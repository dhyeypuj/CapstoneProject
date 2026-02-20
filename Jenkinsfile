//jenkins1

pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "neuralguard-app"
        RECIPIENTS = "disha.sharma23@st.niituniversity.in, adwitiya.sinha23@st.niituniversity.in"
    }

    stages {

        stage('Fetch Code') {
            steps {
                echo "Pulling latest code from GitHub..."
                checkout scm
            }
        }

        stage('Docker Build') {
            steps {
                echo "Building Docker image..."
                bat "docker build -t ${DOCKER_IMAGE} ."
            }
        }
    }

    post {

        success {
    emailext(
        subject: "NeuralGuard Build ${currentBuild.currentResult}",
        body: "Build URL: ${env.BUILD_URL}",
        to: "disha.sharma2607@gmail.com",
        recipientProviders: []
    )
}

        failure {
    emailext(
        subject: "❌ NeuralGuard CI/CD FAILURE - Build #${env.BUILD_NUMBER}",
        body: """
        <h2 style="color:red;">Build Failed 🚨</h2>
        <b>Build URL:</b> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a>
        """,
        mimeType: 'text/html',
        to: "${RECIPIENTS}",
        recipientProviders: []
    )
}

        always {
            echo "Pipeline execution completed."
        }
    }
}