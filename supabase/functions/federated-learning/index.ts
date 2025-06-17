
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ModelUpdate {
  model_name: string;
  local_weights: any;
  training_samples: number;
  performance_metrics: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Authentication failed')
    }

    if (req.method === 'POST') {
      // Submit local model update
      const { model_name, local_weights, training_samples, performance_metrics }: ModelUpdate = await req.json()

      // Find the model
      const { data: model, error: modelError } = await supabaseClient
        .from('ai_models')
        .select('*')
        .eq('model_name', model_name)
        .eq('deployment_status', 'deployed')
        .single()

      if (modelError || !model) {
        throw new Error('Model not found or not deployed')
      }

      // Calculate contribution score based on training samples and performance
      const contributionScore = calculateContributionScore(training_samples, performance_metrics)

      // Insert federated learning update
      const { error: insertError } = await supabaseClient
        .from('federated_learning_updates')
        .insert({
          user_id: user.id,
          model_id: model.id,
          local_weights,
          training_samples,
          performance_delta: performance_metrics.accuracy_improvement || 0,
          contribution_score: contributionScore
        })

      if (insertError) {
        throw insertError
      }

      // Check if we have enough updates to trigger aggregation
      const { data: pendingUpdates, error: countError } = await supabaseClient
        .from('federated_learning_updates')
        .select('id')
        .eq('model_id', model.id)
        .eq('aggregated', false)

      if (!countError && pendingUpdates && pendingUpdates.length >= 5) {
        // Trigger model aggregation
        await aggregateModelUpdates(supabaseClient, model.id)
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          contribution_score: contributionScore,
          pending_updates: pendingUpdates?.length || 0
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    } else if (req.method === 'GET') {
      // Get latest global model
      const modelName = new URL(req.url).searchParams.get('model_name')
      
      if (!modelName) {
        throw new Error('model_name parameter required')
      }

      const { data: model, error: modelError } = await supabaseClient
        .from('ai_models')
        .select('*')
        .eq('model_name', modelName)
        .eq('deployment_status', 'deployed')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()

      if (modelError || !model) {
        throw new Error('Model not found')
      }

      return new Response(
        JSON.stringify(model),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

function calculateContributionScore(trainingSamples: number, performanceMetrics: any): number {
  const sampleWeight = Math.min(trainingSamples / 1000, 1.0) * 0.6
  const performanceWeight = (performanceMetrics.accuracy || 0.5) * 0.4
  return sampleWeight + performanceWeight
}

async function aggregateModelUpdates(supabaseClient: any, modelId: string) {
  // Get all pending updates for this model
  const { data: updates, error: updatesError } = await supabaseClient
    .from('federated_learning_updates')
    .select('*')
    .eq('model_id', modelId)
    .eq('aggregated', false)

  if (updatesError || !updates || updates.length === 0) {
    return
  }

  // Simulate federated averaging
  const aggregatedWeights = simulateFederatedAveraging(updates)
  
  // Update the model with new weights
  const { error: updateError } = await supabaseClient
    .from('ai_models')
    .update({
      weights_data: aggregatedWeights,
      updated_at: new Date().toISOString()
    })
    .eq('id', modelId)

  if (updateError) {
    console.error('Failed to update model:', updateError)
    return
  }

  // Mark updates as aggregated
  const updateIds = updates.map(u => u.id)
  await supabaseClient
    .from('federated_learning_updates')
    .update({ aggregated: true })
    .in('id', updateIds)

  console.log(`Aggregated ${updates.length} model updates for model ${modelId}`)
}

function simulateFederatedAveraging(updates: any[]): any {
  // Simplified federated averaging simulation
  const totalContribution = updates.reduce((sum, update) => sum + update.contribution_score, 0)
  
  // Weight each update by its contribution score
  const aggregatedWeights = {
    layer_weights: updates.map(update => ({
      weight: update.contribution_score / totalContribution,
      local_weights: update.local_weights
    })),
    aggregation_round: Date.now(),
    participants: updates.length
  }

  return aggregatedWeights
}
