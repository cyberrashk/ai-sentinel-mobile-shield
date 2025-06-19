
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Phone, PhoneOff, Video, VideoOff, Mic, MicOff, 
  Monitor, Settings, Users, Maximize2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface CallParticipant {
  id: string;
  name: string;
  avatar?: string;
  isMuted: boolean;
  isVideoEnabled: boolean;
  stream?: MediaStream;
}

interface VoiceVideoCallProps {
  roomId: string;
  callType: 'voice' | 'video' | 'screen_share';
  participants: CallParticipant[];
  onEndCall: () => void;
}

export const VoiceVideoCall = ({ roomId, callType, participants, onEndCall }: VoiceVideoCallProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isCallActive, setIsCallActive] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(callType === 'video');
  const [isScreenSharing, setIsScreenSharing] = useState(callType === 'screen_share');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [peerConnections, setPeerConnections] = useState<Map<string, RTCPeerConnection>>(new Map());
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  // ICE servers configuration for STUN/TURN
  const iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    // Add TURN servers here for production
  ];

  // Initialize local media stream
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        let stream: MediaStream;
        
        if (isScreenSharing) {
          stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true
          });
        } else {
          stream = await navigator.mediaDevices.getUserMedia({
            video: isVideoEnabled,
            audio: true
          });
        }

        setLocalStream(stream);
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Initialize peer connections for each participant
        participants.forEach(participant => {
          if (participant.id !== user?.id) {
            initializePeerConnection(participant.id, stream);
          }
        });

      } catch (error) {
        console.error('Error accessing media devices:', error);
        toast({
          title: "Media Access Error",
          description: "Could not access camera/microphone",
          variant: "destructive"
        });
      }
    };

    initializeMedia();

    return () => {
      // Cleanup streams when component unmounts
      localStream?.getTracks().forEach(track => track.stop());
      peerConnections.forEach(pc => pc.close());
    };
  }, []);

  // Initialize peer connection for a participant
  const initializePeerConnection = async (participantId: string, localStream: MediaStream) => {
    const peerConnection = new RTCPeerConnection({ iceServers });

    // Add local stream tracks to peer connection
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });

    // Handle incoming stream
    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      setRemoteStreams(prev => new Map(prev).set(participantId, remoteStream));
      
      const remoteVideo = remoteVideoRefs.current.get(participantId);
      if (remoteVideo) {
        remoteVideo.srcObject = remoteStream;
      }
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // Send ICE candidate to remote peer via signaling server
        sendSignalingMessage(participantId, {
          type: 'ice-candidate',
          candidate: event.candidate
        });
      }
    };

    // Connection state monitoring
    peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', peerConnection.connectionState);
      if (peerConnection.connectionState === 'failed') {
        toast({
          title: "Connection Failed",
          description: "Failed to establish connection with participant",
          variant: "destructive"
        });
      }
    };

    setPeerConnections(prev => new Map(prev).set(participantId, peerConnection));

    // Create and send offer
    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      
      sendSignalingMessage(participantId, {
        type: 'offer',
        offer: offer
      });
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  // Send signaling message via Supabase realtime
  const sendSignalingMessage = async (targetUserId: string, message: any) => {
    try {
      await supabase
        .from('calls')
        .update({
          webrtc_session_data: {
            from: user?.id,
            to: targetUserId,
            message: message,
            timestamp: Date.now()
          }
        })
        .eq('room_id', roomId)
        .eq('status', 'ongoing');
    } catch (error) {
      console.error('Error sending signaling message:', error);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted;
        setIsMuted(!isMuted);
        
        // Update participant state in database
        updateCallParticipant({ is_muted: !isMuted });
      }
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        setIsVideoEnabled(!isVideoEnabled);
        
        // Update participant state in database
        updateCallParticipant({ is_video_enabled: !isVideoEnabled });
      }
    }
  };

  // Start screen sharing
  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      // Replace video track in all peer connections
      const videoTrack = screenStream.getVideoTracks()[0];
      
      peerConnections.forEach(async (pc, participantId) => {
        const sender = pc.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        
        if (sender) {
          await sender.replaceTrack(videoTrack);
        }
      });

      setIsScreenSharing(true);
      
      // Handle screen share end
      videoTrack.onended = () => {
        setIsScreenSharing(false);
        stopScreenShare();
      };

    } catch (error) {
      console.error('Error starting screen share:', error);
      toast({
        title: "Screen Share Error",
        description: "Could not start screen sharing",
        variant: "destructive"
      });
    }
  };

  // Stop screen sharing
  const stopScreenShare = async () => {
    try {
      // Get user media again
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled,
        audio: true
      });

      const videoTrack = userStream.getVideoTracks()[0];
      
      // Replace screen share track with camera
      peerConnections.forEach(async (pc, participantId) => {
        const sender = pc.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        
        if (sender) {
          await sender.replaceTrack(videoTrack);
        }
      });

      setIsScreenSharing(false);
    } catch (error) {
      console.error('Error stopping screen share:', error);
    }
  };

  // Update call participant state
  const updateCallParticipant = async (updates: any) => {
    try {
      await supabase
        .from('call_participants')
        .update(updates)
        .eq('user_id', user?.id)
        .eq('call_id', roomId); // Assuming roomId is call_id for simplicity
    } catch (error) {
      console.error('Error updating participant:', error);
    }
  };

  // End call
  const handleEndCall = async () => {
    // Stop all tracks
    localStream?.getTracks().forEach(track => track.stop());
    
    // Close all peer connections
    peerConnections.forEach(pc => pc.close());
    
    // Update call status in database
    try {
      await supabase
        .from('calls')
        .update({
          status: 'ended',
          ended_at: new Date().toISOString()
        })
        .eq('room_id', roomId);
        
      // Update participant left time
      await supabase
        .from('call_participants')
        .update({
          left_at: new Date().toISOString()
        })
        .eq('user_id', user?.id);
        
    } catch (error) {
      console.error('Error ending call:', error);
    }
    
    setIsCallActive(false);
    onEndCall();
  };

  return (
    <Card className="w-full h-[600px] bg-slate-900/95 border-slate-700 backdrop-blur-lg">
      <CardContent className="p-0 h-full flex flex-col">
        {/* Video Grid */}
        <div className="flex-1 relative bg-slate-800 rounded-t-lg overflow-hidden">
          {callType === 'voice' ? (
            // Voice call - show avatars
            <div className="flex items-center justify-center h-full">
              <div className="grid grid-cols-2 gap-8">
                {participants.map((participant) => (
                  <div key={participant.id} className="text-center">
                    <Avatar className="h-24 w-24 mx-auto mb-4">
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-2xl">
                        {participant.name[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-white font-medium">{participant.name}</p>
                    <p className="text-slate-400 text-sm">
                      {participant.isMuted ? 'Muted' : 'Active'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Video call - show video streams
            <div className="grid grid-cols-2 gap-2 h-full p-4">
              {/* Local video */}
              <div className="relative bg-slate-700 rounded-lg overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
                  You {isMuted && '(Muted)'}
                </div>
              </div>

              {/* Remote videos */}
              {participants
                .filter(p => p.id !== user?.id)
                .map((participant) => (
                  <div key={participant.id} className="relative bg-slate-700 rounded-lg overflow-hidden">
                    <video
                      ref={(el) => {
                        if (el) remoteVideoRefs.current.set(participant.id, el);
                      }}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
                      {participant.name} {participant.isMuted && '(Muted)'}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Call Controls */}
        <div className="p-6 bg-slate-900 border-t border-slate-700">
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant={isMuted ? "destructive" : "secondary"}
              size="lg"
              onClick={toggleMute}
              className="rounded-full w-12 h-12"
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            {callType !== 'voice' && (
              <Button
                variant={!isVideoEnabled ? "destructive" : "secondary"}
                size="lg"
                onClick={toggleVideo}
                className="rounded-full w-12 h-12"
              >
                {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>
            )}

            <Button
              variant={isScreenSharing ? "default" : "secondary"}
              size="lg"
              onClick={isScreenSharing ? stopScreenShare : startScreenShare}
              className="rounded-full w-12 h-12"
            >
              <Monitor className="h-5 w-5" />
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="rounded-full w-12 h-12"
            >
              <Users className="h-5 w-5" />
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="rounded-full w-12 h-12"
            >
              <Settings className="h-5 w-5" />
            </Button>

            <Button
              variant="destructive"
              size="lg"
              onClick={handleEndCall}
              className="rounded-full w-12 h-12"
            >
              <PhoneOff className="h-5 w-5" />
            </Button>
          </div>

          <div className="text-center mt-4">
            <p className="text-slate-400 text-sm">
              🔒 End-to-end encrypted call • {participants.length} participants
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
