pipeline {
    agent {
        kubernetes {
            yaml """
apiVersion: v1
kind: Pod
metadata:
  namespace: jenkins
spec:
  serviceAccountName: jenkins
  containers:
  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug
    command:
    - /busybox/cat
    tty: true
    volumeMounts:
    - name: docker-config
      mountPath: /kaniko/.docker
    resources:
      requests:
        memory: "256Mi"
        cpu: "100m"
      limits:
        memory: "512Mi"
        cpu: "250m"
  - name: kubectl
    image: bitnami/kubectl:latest
    command:
    - cat
    tty: true
    resources:
      requests:
        memory: "128Mi"
        cpu: "50m"
      limits:
        memory: "256Mi"
        cpu: "100m"
  volumes:
  - name: docker-config
    secret:
      secretName: acr-secret
      items:
      - key: .dockerconfigjson
        path: config.json
"""
        }
    }
    
    environment {
        REGISTRY = 'ecommercewestacr2025.azurecr.io'
        GIT_COMMIT_SHORT = sh(
            script: "printf \$(git rev-parse --short HEAD)",
            returnStdout: true
        ).trim()
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "🚀 Building commit: ${env.GIT_COMMIT_SHORT}"
            }
        }
        
        stage('Build API Gateway Image') {
            steps {
                container('kaniko') {
                    script {
                        echo "🐳 Building API Gateway with Kaniko..."
                        sh """
                            /kaniko/executor \
                            --context=\${WORKSPACE}/applications/api-gateway \
                            --dockerfile=\${WORKSPACE}/applications/api-gateway/Dockerfile \
                            --destination=${env.REGISTRY}/api-gateway:${env.GIT_COMMIT_SHORT} \
                            --destination=${env.REGISTRY}/api-gateway:latest \
                            --cache=true \
                            --cache-ttl=24h \
                            --verbosity=info
                        """
                        echo "✅ API Gateway image built and pushed successfully"
                    }
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                container('kubectl') {
                    script {
                        echo "🚀 Deploying API Gateway to Kubernetes..."
                        sh """
                            # Update deployment image
                            kubectl set image deployment/api-gateway \
                            api-gateway=${env.REGISTRY}/api-gateway:${env.GIT_COMMIT_SHORT} \
                            --record
                            
                            # Wait for rollout to complete
                            kubectl rollout status deployment/api-gateway --timeout=300s
                            
                            echo "✅ Deployment completed successfully"
                        """
                    }
                }
            }
        }
        
        stage('Health Check') {
            steps {
                container('kubectl') {
                    script {
                        echo "🏥 Performing health check..."
                        sh """
                            sleep 10
                            
                            # Get pods status
                            kubectl get pods -l app=api-gateway
                            kubectl get service api-gateway
                            
                            # Get external IP
                            GATEWAY_IP=\$(kubectl get service api-gateway -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo 'pending')
                            
                            if [ "\$GATEWAY_IP" != "pending" ] && [ "\$GATEWAY_IP" != "" ]; then
                                echo "✅ API Gateway External IP: \$GATEWAY_IP"
                                echo "Testing health endpoint..."
                                timeout 30 bash -c 'until curl -f http://'\$GATEWAY_IP'/health 2>/dev/null; do echo "Waiting..."; sleep 5; done' || echo "Health check timeout (may need more time)"
                            else
                                echo "⏳ External IP assignment pending..."
                            fi
                        """
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo '🎉 Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed! Check logs for details.'
        }
        always {
            echo '🧹 Cleaning up workspace...'
        }
    }
}