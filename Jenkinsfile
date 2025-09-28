
pipeline {
    agent any
    
    environment {
        REGISTRY = 'ecommercewestacr2025.azurecr.io'
        REGISTRY_CREDENTIAL = 'acr-credentials'
        KUBECONFIG_CREDENTIAL = 'kubeconfig'
        GIT_COMMIT_SHORT = sh(
            script: "printf \$(git rev-parse --short ${GIT_COMMIT})",
            returnStdout: true
        )
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "🚀 Building commit: ${env.GIT_COMMIT_SHORT}"
            }
        }
        
        stage('Test Kubernetes Connection') {
            steps {
                script {
                    withCredentials([file(credentialsId: env.KUBECONFIG_CREDENTIAL, variable: 'KUBECONFIG')]) {
                        sh """
                            export KUBECONFIG=\$KUBECONFIG
                            echo "Testing Kubernetes connection..."
                            kubectl cluster-info
                            kubectl get nodes
                            kubectl get pods --all-namespaces
                        """
                    }
                }
            }
        }
        
        stage('Build API Gateway Image') {
            steps {
                script {
                    echo "🐳 Building API Gateway Docker image..."
                    def image = docker.build("${env.REGISTRY}/api-gateway:${env.GIT_COMMIT_SHORT}", "./applications/api-gateway")
                    
                    echo "📤 Pushing to ACR..."
                    docker.withRegistry("https://${env.REGISTRY}", env.REGISTRY_CREDENTIAL) {
                        image.push()
                        image.push("latest")
                    }
                    echo "✅ API Gateway image pushed successfully"
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    withCredentials([file(credentialsId: env.KUBECONFIG_CREDENTIAL, variable: 'KUBECONFIG')]) {
                        sh """
                            export KUBECONFIG=\$KUBECONFIG
                            
                            echo "🚀 Updating API Gateway deployment..."
                            
                            # Update image tag in deployment
                            sed -i 's|${env.REGISTRY}/api-gateway:.*|${env.REGISTRY}/api-gateway:${env.GIT_COMMIT_SHORT}|g' kubernetes/deployments/api-gateway.yaml
                            
                            # Apply deployment
                            kubectl apply -f kubernetes/deployments/api-gateway.yaml
                            
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
                script {
                    withCredentials([file(credentialsId: env.KUBECONFIG_CREDENTIAL, variable: 'KUBECONFIG')]) {
                        sh """
                            export KUBECONFIG=\$KUBECONFIG
                            
                            echo "🏥 Performing health check..."
                            sleep 30
                            
                            # Get service status
                            kubectl get pods -l app=api-gateway
                            kubectl get service api-gateway
                            
                            # Get external IP
                            GATEWAY_IP=\$(kubectl get service api-gateway -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
                            echo "API Gateway External IP: \$GATEWAY_IP"
                            
                            if [ -n "\$GATEWAY_IP" ] && [ "\$GATEWAY_IP" != "null" ]; then
                                echo "Testing health endpoint..."
                                timeout 60 bash -c 'until curl -f http://'\$GATEWAY_IP'/health; do echo "Waiting for health check..."; sleep 5; done'
                                echo "✅ Health check passed!"
                            else
                                echo "⚠️ External IP not yet assigned, but deployment completed"
                            fi
                        """
                    }
                }
            }
        }
    }
    
    post {
        success {
            script {
                withCredentials([file(credentialsId: env.KUBECONFIG_CREDENTIAL, variable: 'KUBECONFIG')]) {
                    def gatewayIP = sh(
                        script: """
                            export KUBECONFIG=\$KUBECONFIG
                            kubectl get service api-gateway -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo 'pending'
                        """,
                        returnStdout: true
                    ).trim()
                    
                    if (gatewayIP && gatewayIP != 'pending' && gatewayIP != 'null') {
                        echo "🎉 Deployment successful!"
                        echo "🌐 Application available at: http://${gatewayIP}"
                    } else {
                        echo "🎉 Deployment successful!"
                        echo "⏳ External IP assignment pending..."
                    }
                }
            }
        }
        failure {
            echo '❌ Deployment failed! Check logs for details.'
        }
        always {
            echo '🧹 Cleaning up workspace...'
            cleanWs()
        }
    }
}