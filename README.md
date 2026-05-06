# YT BG Player

iPhone Safari で YouTube をバックグラウンド再生するための Web アプリ。  
Raspberry Pi 上の FastAPI で音声 URL を取得し、`<audio>` タグで再生します。

---

## 使い方

1. Cloudflare Tunnel の URL をブラウザで開く
2. YouTube の URL を貼り付けて「読込」
3. 再生ボタンを押す
4. 画面を閉じてもバックグラウンドで再生が続く
5. ロック画面のコントローラーで再生・一時停止できる

### セットリスト機能

「セットリストを取得」ボタンを押すと、概要欄またはコメント欄からタイムスタンプを自動取得します。  
曲名をタップするとその位置から再生します（コメント検索は 10〜20 秒かかる場合があります）。

---

## Cloudflare Tunnel URL の確認方法

Raspberry Pi を再起動すると URL が変わります。  
**同じ Wi-Fi につながった状態**でブラウザから以下にアクセスしてください。

```
http://raspberrypi.local:8000/tunnel-url
```

現在の URL がリンクとして表示されるのでタップして開けます。

> スマートフォンが Wi-Fi に接続されていれば、外出先から帰ったときもこの手順で新しい URL を確認できます。

---

## Raspberry Pi の構成

| 項目 | 内容 |
|------|------|
| バックエンド | FastAPI + yt-dlp (`/home/pi/main.py`)、音声フォーマット: M4A(AAC) 優先 |
| 起動管理 | systemd (`yt-bg-player.service`, `cloudflared.service`) |
| フロントエンド | `dist/` を FastAPI の StaticFiles で配信 |

### サービスの状態確認（SSH 接続時）

```bash
sudo systemctl status yt-bg-player
sudo systemctl status cloudflared
```

### フロントエンドを更新したとき

Windows 側でビルド・転送後に再起動：

```bash
sudo systemctl restart yt-bg-player
```

### Pi 再起動後に自動起動しない場合

```bash
sudo systemctl enable yt-bg-player cloudflared
sudo systemctl start yt-bg-player cloudflared
```
