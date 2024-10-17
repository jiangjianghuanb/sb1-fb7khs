document.getElementById('pptForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const resultDiv = document.getElementById('result');
    
    resultDiv.innerHTML = '<p>正在生成PPT...请稍候。</p>';
    
    try {
        const response = await fetch('/generate', {
            method: 'POST',
            body: formData
        });
        
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error + (data.details ? ': ' + data.details : ''));
            }
            
            resultDiv.innerHTML = `<p>PPT生成成功！</p><a href="${data.file}" download>下载PPT</a>`;
        } else {
            const text = await response.text();
            throw new Error('服务器返回了非JSON响应: ' + text);
        }
    } catch (error) {
        console.error('错误:', error);
        resultDiv.innerHTML = `<p class="error">生成PPT时出错: ${error.message}</p>`;
    }
});

// 改进的全局错误处理
window.addEventListener('error', function(event) {
    console.error('全局错误:', event.error);
    logErrorToServer(event.error);
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<p class="error">发生未知错误: ${event.error.message}</p>`;
});

// 改进的未捕获的Promise错误处理
window.addEventListener('unhandledrejection', function(event) {
    console.error('未处理的Promise拒绝:', event.reason);
    logErrorToServer(event.reason);
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<p class="error">发生未处理的异步错误: ${event.reason}</p>`;
});

// 添加错误日志记录函数
function logErrorToServer(error) {
    fetch('/log-error', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        }),
    }).catch(console.error);
}