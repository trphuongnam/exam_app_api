<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certification</title>
  <style>
    body {
      height: 100vh;
      margin: 0;
      display: grid;
      place-items: center;
      font-family: Arial, Helvetica, sans-serif;
    }

    .module-border-wrap {
      width: 800px;
      height: 1200px;
      padding: 1rem;
      position: relative;
    }

    .module {
      height: 1140px;
      color: white;
      padding: 2rem;
    }

    .frame {
      display: flex;
      flex-direction: row;
    }

    .frame_border {
      display: flex;
      flex-direction: column;
      height: calc(1140px - 2rem);
      position: relative;
      z-index: 0;
      width: 100%;
    }

    .content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      max-width: 650px;
      width: 650px;
      z-index: 999;
      text-align: center;
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        margin-top: 120px;
    }

    .header .logo {
      width: 400px;
    }

    .header h3 {
        margin: 0;
        font-size: 25px;
        color: #1c3b8e;
    }

    .header p {
        margin: 0;
        font-size: 18px;
        color: #666;
    }

    .title {
        margin-top: 30px;
    }

    .title h2 {
        font-size: 70px;
        margin: 10px 0;
        color: #666;
        font-weight: 500;
    }

    .title h1 {
        font-size: 80px;
        letter-spacing: 35px;
        margin: 20px 0;
        color: #1c3b8e;
        font-weight: 500;
    }

    .title p {
        font-size: 20px;
        margin: 10px 0;
        color: #666;
    }

    .details {
        margin-top: 20px;
        font-size: 20px;
        color: #666;
        line-height: 1.6;
    }

    .certificate-date {
      display: flex;
      width: fit-content;
      margin: 0 auto;
      text-align: left;
      font-size: 16px;
    }

    .certificate-date__label {
      width: 100px;
    }

    .certificate-date__value {
      min-width: 130px;
    }

    .footer {
        margin-top: 30px;
        font-size: 18px;
        color: #000;
        position: relative;
    }

    .footer .seal {
      position: absolute;
      bottom: 20px;
      right: 20px;
      z-index: 999;
      top: -30%;
      left: 70%;
      transform: translate(-50%, -50%);
    }

    .footer .seal img {
        width: 100px;
    }

    .font-16 {
      font-size: 16px;
    }

    .border_title {
      width: 500px;
      height: 20px;
      background-repeat: no-repeat;
      background-size: contain;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <div class="module-border-wrap">
    <div
      class="module"
      style="
        background: url('{{$background}}');
        background-size: 100%;
        background-repeat: no-repeat;
      "
    >
      <div class="frame">
        <div class="frame_border">
          <div class="content">
            <div class="header">
                <h3>Java レベル6</h3>
            </div>
            <div class="title">
                <h1>合格証書</h1>
                {{$lines}}
                <div class="border_title" style="background-image: url('{{$lines}}');"></div>
                <p>THIS CERTIFICATE IS PROUDLY PRESENTED TO</p>
                <h2>プロ検 太郎</h2>
            </div>
            <div class="details">
                <p>
                  当協会主催 プログラミング能力検定 2020年2月検定において<br>
                  頭書のレベルに合格したことを証明します。
                </p>
                <div class="certificate-date">
                  <div class="certificate-date__label">受験日：</div>
                  <div class="certificate-date__value">2020年2月14日</div>
                </div>
                <div class="certificate-date">
                  <div class="certificate-date__label">資格発行日：</div>
                  <div class="certificate-date__value">2020年3月1日</div>
                </div>
                <p class="font-16">証書番号：20200214_2593_00000_JP</p>
            </div>
            <div class="footer">
                <h2>プログラミング能力検定協会</h2>
                <div class="seal">
                  <img src="{{$stamp}}" alt="Seal">
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>