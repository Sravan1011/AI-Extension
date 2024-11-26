// services/PriorityPredictor.js
export class PriorityPredictor {
  static async loadModel() {
    try {
      const response = await fetch(chrome.runtime.getURL('model/preprocessing_params.json'));
      const params = await response.json();
      return params;
    } catch (error) {
      console.error('Error loading model parameters:', error);
      throw error;
    }
  }

  static async predictPriority(taskData) {
    try {
      const params = await this.loadModel();
      
      // Calculate base score using importance weights
      const importanceWeight = params.priority_config.importance_weights[taskData.importance] || 0.5;
      
      // Adjust for workload
      const workloadImpact = taskData.workload > 0.7 ? 
        params.priority_config.workload_impact.threshold_adjust : 0;
      
      // Calculate time of day impact
      const timeWeights = {
        'Morning': 0.2,
        'Afternoon': 0.15,
        'Evening': 0.1,
        'Night': 0.05
      };
      const timeImpact = timeWeights[taskData.preferredTime] || 0.1;
      
      // Calculate estimated time impact
      const timeImpact2 = Math.min(taskData.estimatedTime / 8, 1) * 0.15;
      
      // Calculate text-based impact using simple keyword matching
      const urgentKeywords = ['urgent', 'critical', 'immediate', 'asap', 'emergency'];
      const textScore = this.calculateTextScore(
        taskData.title + ' ' + taskData.description,
        urgentKeywords
      );
      
      // Combine all factors
      const rawScore = (
        importanceWeight * 0.4 +
        taskData.workload * 0.2 +
        timeImpact +
        timeImpact2 +
        textScore * 0.15
      );
      
      // Adjust threshold based on workload
      const adjustedThreshold = 
        params.priority_config.prediction_threshold - workloadImpact;
      
      // Determine priority
      const isHighPriority = rawScore > adjustedThreshold;
      
      // Calculate confidence
      const baseConfidence = isHighPriority ? rawScore : (1 - rawScore);
      let confidence = baseConfidence * importanceWeight;
      
      // Adjust confidence based on workload for high priority tasks
      if (isHighPriority && taskData.workload > 0.7) {
        confidence += params.priority_config.workload_impact.confidence_boost;
      }
      
      // Ensure confidence stays in [0,1] range
      confidence = Math.min(Math.max(confidence, 0), 1);
      
      return {
        priority: isHighPriority ? 'High' : 'Normal',
        confidence: confidence,
        raw_score: rawScore,
        adjusted_threshold: adjustedThreshold,
        features_used: {
          importance: taskData.importance,
          workload: taskData.workload,
          time: taskData.preferredTime,
          estimated_time: taskData.estimatedTime,
          text_score: textScore
        }
      };
    } catch (error) {
      console.error('Error predicting priority:', error);
      throw error;
    }
  }

  static calculateTextScore(text, keywords) {
    const lowerText = text.toLowerCase();
    let score = 0;
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        score += 0.2;
      }
    });
    return Math.min(score, 1);
  }
}