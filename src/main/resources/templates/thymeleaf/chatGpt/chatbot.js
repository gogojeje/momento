// 정용준: 이 코드는 웹 페이지에서 OpenAI의 GPT-3.5 Turbo 모델을 사용하여 챗봇과 대화할 수 있는
//        간단한 인터페이스를 만드는 JavaScript 코드입니다.

// 채팅 메시지를 표시할 DOM
const chatMessages = document.querySelector('#chat-messages');
// 사용자 입력 필드
const userInput = document.querySelector('#user-input input');
// 전송 버튼
const sendButton = document.querySelector('#user-input button');
// 발급받은 OpenAI API 키를 변수로 저장
const apiKey = "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";
// OpenAI API 엔드포인트 주소를 변수로 저장
const apiEndpoint = 'https://api.openai.com/v1/chat/completions';

// 함수: 메시지를 추가하는 함수
function addMessage(sender, message) {
    // 새로운 div 생성
    const messageElement = document.createElement('div');
    // 생성된 요소에 클래스 추가
    messageElement.className = 'message';
    // 채팅 메시지 목록에 새로운 메시지 추가
    messageElement.textContent = `${sender}: ${message}`;
    chatMessages.prepend(messageElement);
}

// 함수: API 응답을 요청하고 처리하는 함수
async function fetchAIResponse(prompt) {
    // API 요청에 사용할 옵션을 정의
    const requestOptions = {
        method: 'POST',
        // API 요청의 헤더를 설정
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",  // 사용할 AI 모델
            messages: [{
                role: "user", // 메시지 역할을 user로 설정
                content: prompt // 사용자가 입력한 메시지
            }],
            temperature: 0.8, // 모델의 출력 다양성
            max_tokens: 1024, // 응답받을 메시지 최대 토큰(단어) 수 설정
            top_p: 1, // 토큰 샘플링 확률을 설정
            frequency_penalty: 0.5, // 일반적으로 나오지 않는 단어를 억제하는 정도
            presence_penalty: 0.5, // 동일한 단어나 구문이 반복되는 것을 억제하는 정도
            stop: ["Human"], // 생성된 텍스트에서 종료 구문을 설정
        })
    };

    // 로딩 표시 추가
    showLoading();

    // API 요청후 응답 처리
    try {
        const response = await fetch(apiEndpoint, requestOptions);
        const data = await response.json();
        const aiResponse = data.choices[0].message.content;
        return aiResponse;
    } catch (error) {
        console.error('OpenAI API 호출 중 오류 발생:', error);
        return 'OpenAI API 호출 중 오류 발생';
    } finally {
        // 로딩 표시 숨기기
        hideLoading();
    }
}

// 함수: 로딩 표시를 보여주는 함수
function showLoading() {
    const loadingElement = document.createElement('div');
    loadingElement.className = 'message loading';
    loadingElement.textContent = '타자 치는 중...(1분 이상 걸릴 수도!)';
    chatMessages.prepend(loadingElement);
}

// 함수: 로딩 표시를 숨기는 함수
function hideLoading() {
    // 화면에서 로딩 요소를 제거
    const loadingElement = document.querySelector('.message.loading');
    if (loadingElement) {
        loadingElement.remove();
    }
}

// 전송 버튼 클릭 이벤트 처리
sendButton.addEventListener('click', async () => {
    // 사용자가 입력한 메시지
    const message = userInput.value.trim();
    // 메시지가 비어있으면 리턴
    if (message.length === 0) return;
    // 사용자 메시지 화면에 추가
    addMessage('나', message);
    userInput.value = '';

    try {
        // ChatGPT API 요청 후 답변을 화면에 추가
        const aiResponse = await fetchAIResponse(message);
        addMessage('챗봇', aiResponse);
    } catch (error) {
        // 오류가 발생하면 오류 메시지를 표시할 수 있습니다.
        console.error('API 요청 오류:', error);
        addMessage('챗봇', 'API 요청 중 오류가 발생했습니다.');
    }
});

// 사용자 입력 필드에서 Enter 키 이벤트를 처리
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});
