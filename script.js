// ユーザー登録フォームのイベントリスナー
document.getElementById("userForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const profile = document.getElementById("profile").value;
  
    fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, profile })
    })
    .then(response => response.json())
    .then(data => {
      alert('ユーザーが登録されました！');
      console.log(data);
    })
    .catch(error => {
      console.error('エラーが発生しました', error);
    });
  });
  
  // ツイート作成フォームのイベントリスナー
  document.getElementById("tweetForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const tweetMessage = document.getElementById("tweetMessage").value;
  
    // ログインユーザー情報を仮定
    const user_id = 1;
  
    fetch('/api/tweets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_id, messages: tweetMessage })
    })
    .then(response => response.json())
    .then(data => {
      alert('ツイートが作成されました！');
      console.log(data);
    })
    .catch(error => {
      console.error('エラーが発生しました', error);
    });
  });
  
// ツイートの表示
function displayTweet(tweet) {
    const tweetList = document.getElementById("tweetList");
    const tweetDiv = document.createElement("div");
    tweetDiv.classList.add("tweet");
    tweetDiv.innerHTML = `<p>${tweet.messages}</p>`;
    tweetList.prepend(tweetDiv);
  }
  
  // ツイートの取得と表示
  async function getTweetsAndDisplay() {
    try {
      const response = await fetch('/api/tweets');
      const tweets = await response.json();
      
      const tweetList = document.getElementById('tweetList');
      tweetList.innerHTML = ''; // 既存のツイートをクリア
  
      tweets.forEach(displayTweet); // ツイートを表示する関数を呼び出す
    } catch (error) {
      console.error('Failed to get tweets:', error);
    }
  }
  
  // ページロード時にツイートを取得して表示
  document.addEventListener('DOMContentLoaded', getTweetsAndDisplay);
  
  // テストデータとして表示する
  const sampleTweet = { messages: "これはサンプルツイートです。" };
  displayTweet(sampleTweet);
  