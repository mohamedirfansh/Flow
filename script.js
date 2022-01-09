const API_KEY = 'YOUR_API_KEY';

const transcriptBox = document.createElement('button');
transcriptBox.innerHTML = 'transcribe';
transcriptBox.className = 'transcribeBox';

const summarizeBox = document.createElement('button');
summarizeBox.innerHTML = 'summarize';
summarizeBox.className = 'summarizeBox';

const buttonContainer = document.createElement('div');
buttonContainer.className = 'buttonContainer';
buttonContainer.appendChild(transcriptBox);
buttonContainer.appendChild(summarizeBox);

const videoContainer = document.getElementById('movie_player');
videoContainer.appendChild(buttonContainer);

const summaryLength = 75;

let originalVideoTranscript;
let summarizedVideoTranscript;

function openTranscriptionBox() {
  setTimeout(() => {
    document.getElementsByClassName('style-scope ytd-menu-renderer')[6].click();
    setTimeout(() => {
      document
        .getElementsByClassName('style-scope ytd-menu-service-item-renderer')[4]
        .click();
    }, 100);
  }, 2500);
}

function getTranscription() {
  const transcriptDivs = document.getElementsByClassName(
    'cue style-scope ytd-transcript-body-renderer'
  );
  let transcript = [];
  for (let i = 0; i < transcriptDivs.length; i++) {
    transcript.push(transcriptDivs[i].innerHTML.trim());
  }
  for (let j = 10; j < transcript.length; j += 10) {
    transcript.splice(j, 0, '<br><br>');
  }
  originalVideoTranscript = transcript.join('. ');
}

function closeTranscriptionBox() {
  setTimeout(() => {
    document
      .getElementsByClassName(
        'style-scope ytd-engagement-panel-title-header-renderer'
      )[14]
      .click();
  }, 3020);
}

function transcribeClick() {
  openTranscriptionBox();
  setTimeout(getTranscription, 3000);

  setTimeout(() => {
    const body = `
      <div style="margin: 2rem 2rem 0 2rem; padding: 2rem 2rem 0 2rem;">
        <h1 style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Your video transcript:</h1>
      </div>
      <div style="margin: 2rem; padding: 2rem">
        <p style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${originalVideoTranscript}</p>
      </div>
    `;
    const myWindow = window.open('', 'MsgWindow', 'scrollbars=yes');
    myWindow.document.write(body);
    console.log(originalVideoTranscript.match(/\w[.?!](\s|$)/g).length);
  }, 3010);

  closeTranscriptionBox();
}

function summarizeClick() {
  openTranscriptionBox();
  setTimeout(getTranscription, 3000);

  setTimeout(() => {
    // To send the transcript to api and get the summary back
    const formdata = new FormData();
    formdata.append('key', API_KEY);
    formdata.append('txt', originalVideoTranscript);
    formdata.append('sentences', summaryLength);

    const requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    };

    const response = fetch(
      'https://api.meaningcloud.com/summarization-1.0',
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        summarizedVideoTranscript = data.summary;

        const bodySummary = `
          <div style="margin: 2rem 2rem 0 2rem; padding: 2rem 2rem 0 2rem;">
            <h1 style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Your video summary:</h1>
          </div>
          <div style="margin: 2rem; padding: 2rem">
            <p style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${summarizedVideoTranscript}</p>
          </div>
        `;

        const myWindow = window.open('', 'MsgWindow', 'scrollbars=yes');
        myWindow.document.write(bodySummary);
      })
      .catch((error) => console.log('error', error));
  }, 3010);

  closeTranscriptionBox();
}

transcriptBox.onclick = transcribeClick;
summarizeBox.onclick = summarizeClick;
