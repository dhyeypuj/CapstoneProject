pipeline {
    agent any

    stages {
        stage('Fetch Code') {
            steps {
                checkout scm
            }
        }

        stage('Docker Build') {
            steps {
                bat "docker --version"
            }
        }
    }

    post {
        success {
            emailext(
                subject: "Build ${currentBuild.currentResult}",
                body: "Build URL: ${env.BUILD_URL}",
                to: "disha.sharma2607@gmail.com",
                recipientProviders: []
            )
        }
    }
}