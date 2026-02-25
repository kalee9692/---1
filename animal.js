const MODEL_URL = 'https://teachablemachine.withgoogle.com/models/-SYoyZT8h/';

const imageUpload = document.getElementById('image-upload');
const cameraToggle = document.getElementById('camera-toggle');
const analyzeButton = document.getElementById('analyze');
const statusEl = document.getElementById('status');
const webcamEl = document.getElementById('webcam');
const snapshotEl = document.getElementById('snapshot');
const previewImg = document.getElementById('image-preview');
const resultPrimary = document.getElementById('result-primary');
const resultList = document.getElementById('result-list');

let model;
let webcam;
let currentImage = null;
let usingWebcam = false;

const labelMap = {
    dog: '강아지상',
    cat: '고양이상',
    puppy: '강아지상',
    kitty: '고양이상'
};

function formatLabel(label) {
    if (!label) return '분석 결과';
    const key = label.toLowerCase();
    return labelMap[key] || label;
}

function updateStatus(message) {
    statusEl.textContent = message;
}

function setPreviewState({ showVideo, showImage }) {
    webcamEl.style.display = showVideo ? 'block' : 'none';
    snapshotEl.style.display = showVideo ? 'block' : 'none';
    previewImg.style.display = showImage ? 'block' : 'none';
}

async function loadModel() {
    updateStatus('모델 로딩 중...');
    if (!window.tmImage) {
        throw new Error('Teachable Machine library not loaded');
    }
    model = await tmImage.load(`${MODEL_URL}model.json`, `${MODEL_URL}metadata.json`);
    updateStatus('준비 완료! 사진을 올려보세요.');
}

function resetResults() {
    resultPrimary.textContent = '이미지를 선택해 주세요.';
    resultList.innerHTML = '';
}

function renderResults(predictions) {
    if (!predictions || predictions.length === 0) {
        resultPrimary.textContent = '결과를 가져오지 못했어요.';
        return;
    }

    const sorted = [...predictions].sort((a, b) => b.probability - a.probability);
    const top = sorted[0];
    resultPrimary.textContent = `${formatLabel(top.className)} ${Math.round(top.probability * 100)}%`;

    resultList.innerHTML = '';
    sorted.forEach((item) => {
        const percent = Math.round(item.probability * 100);
        const li = document.createElement('li');
        li.className = 'result-item';
        li.innerHTML = `
            <div>
                <div>${formatLabel(item.className)}</div>
                <div class="bar"><div class="bar-fill" style="width:${percent}%"></div></div>
            </div>
            <div>${percent}%</div>
        `;
        resultList.appendChild(li);
    });
}

function enableAnalyze(enabled) {
    analyzeButton.disabled = !enabled;
}

imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImg.src = e.target.result;
        currentImage = previewImg;
        setPreviewState({ showVideo: false, showImage: true });
        usingWebcam = false;
        enableAnalyze(true);
        resetResults();
    };
    reader.readAsDataURL(file);
});

cameraToggle.addEventListener('click', async () => {
    if (!model) return;
    if (usingWebcam) {
        usingWebcam = false;
        if (webcam) {
            webcam.stop();
        }
        setPreviewState({ showVideo: false, showImage: false });
        updateStatus('카메라가 꺼졌어요. 사진을 업로드해 주세요.');
        enableAnalyze(false);
        return;
    }

    usingWebcam = true;
    webcam = new tmImage.Webcam(320, 320, true);
    await webcam.setup();
    await webcam.play();
    webcamEl.srcObject = webcam.webcam;
    setPreviewState({ showVideo: true, showImage: false });
    updateStatus('카메라가 켜졌어요. 분석 버튼을 눌러주세요.');
    enableAnalyze(true);
});

analyzeButton.addEventListener('click', async () => {
    if (!model) return;
    if (usingWebcam && webcam) {
        webcam.update();
        const ctx = snapshotEl.getContext('2d');
        ctx.drawImage(webcam.canvas, 0, 0, snapshotEl.width, snapshotEl.height);
        currentImage = snapshotEl;
    }

    if (!currentImage) {
        updateStatus('이미지를 먼저 선택해 주세요.');
        return;
    }

    updateStatus('분석 중...');
    const predictions = await model.predict(currentImage);
    renderResults(predictions);
    updateStatus('분석 완료!');
});

loadModel().catch(() => {
    updateStatus('모델 로딩에 실패했어요. 새로고침 후 다시 시도해 주세요.');
});
