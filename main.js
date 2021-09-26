'use strict';




{
  const today = new Date();   //new Date()で今日の年、日付を取得する。
  let year = today.getFullYear(); //今日の日付の年をgetFullYear()で取得する。
  let month = today.getMonth(); //今日が何月かをgetMonth()で取得する。


  //カレンダー一週目で、先月数日分を取得する。
  function getCalendarHead() {
    const dates = [];
    const d = new Date(year, month, 0).getDate();   //先月末日を取得する。日付の取得はgetDate()で取得する。
    const n = new Date(year, month, 1).getDay();    //今月1日が週の何番目かをgetDay()で取得する。


    for(let i = 0; i < n; i++) {
      dates.unshift({
        date: d - i,
        isToday: false,
        isDisabled: true,
      });
    }
//0からnに満たないまでループを回す。
//27, 28, 29, 30, 31と後でできたものを前に配置したいので、unshift()で要素を配列に入れる。
 //d(末日) - i(0からnに満たないまで)を引くと、週の残りの末日を取得することができる。
//先月の日付は今日にはならないので、false
 //先月の日数は半透明にしたいので、true

    return dates;                      //後で他の関数で使うので、return
  }

  //今月の日数を取得する。
  function getCalendarBody() {
    const dates = []; // date: 日付, day: 曜日
    const lastDate = new Date(year, month + 1, 0).getDate();   //今月末日をgetDateで取得する。

    for (let i = 1; i <= lastDate; i++) {    //1日から末日を含む回数分、ループを回す。
      dates.push({
        date: i,
        isToday: false,    //判定が難しいので、falseにしておく。後で手動でtrueにする。
        isDisabled: false,  //今月分の日数は半透明にしないので、false。
      });
    }

    if(year === today.getFullYear() && month === today.getMonth()) {
      dates[today.getDate() - 1].isToday = true;
    }

    //yearが今日の年と同じであり、またmontuが今日の月と同じであれば、
    //配列datesからtoday(newDate)からgetDateで日付を取り、それを-1したもののisTodayにtrueを代入する。
    //-1するのは、配列から要素の取得をするからである。配列から要素を取得するのは、0 ~ からの番号である。
    //例えば、今日の日付が3日なら、配列の番号では2番目なので、3 - 1で2として要素を取る。
   

    

    return dates;         //後で使うので、returnする。
  }

  // カレンダーの最終週を作る。この週は今月末の数日と、来月初めの数月が存在する。
  function getCalendarTail() {
    const dates = [];
    const lastDay = new Date(year, month + 1, 0).getDay();  //今月の末日画集の何日目かを取得する。　末日の公式：new Date(year, month + 1, 0)

    for (let i = 1; i < 7 - lastDay; i++) {  //lastDayはgetDay()で末日が週の名番目かを取得している。つまり7日-lastDayをすると、残り何日が来月の日数が分かる。let i = 1にするのは、日付は1から始まるから。
      dates.push({
        date: i,   //１から7 - lastDayに満たないまでの数字を入れる。
        isToday: false,  //来月分は今月分で今日にはならないので、false
        isDisabled: true,  //来月分は半透明にしておくのでtrue
      });
    }

    return dates;    //後で違う関数内で来月分の数日を使うので、returnしておく。
  }

  //翌月、先月に行くと、今まで映してあったものが表示されたままなので、元の月の表示をなくす処理。
  function clearCalendar() {
    const tbody = document.querySelector('tbody');

    //親要素を取得した後で、
    // while (親要素.firstChild) {
    //   親要素.removeChild(親要素.firsChild)
    // }
    // で今まで表示していた月の表示をなくすことができる。

    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild)          
    }
  }

  // 月を変えると, カレンダー上部のタイトルを変化させる。
  function renderTitle() {
    const title = `${year}/${String(month + 1).padStart(2, '0')}`;    //文字列でmonthを表したい。monthは０から始まるので、文字列にするには + 1してあげる。
    document.getElementById('title').textContent = title;
  }


  //カレンダーの週を作り、1日のtextヲ入れる。
  function renderWeeks() {

    // dates配列に、1週目の先月分の日付、今月分の日付、最終週の来月分の数日を入れる。ここで三つの関数で取得したそれぞれのdates配列を入れるので、それぞれの関数内でreturn dates;とした。
    //ここでカレンダーに必要な要素はすべて取得した。
    const dates = [
      ...getCalendarHead(),
      ...getCalendarBody(),
      ...getCalendarTail(),
    ];


    const weeks = [];
    const weeksCount = dates.length / 7;    //datesにはカレンダーの全ての日数が取得されているため、それを7で割れば週数を取得できる。

    for (let i = 0; i < weeksCount; i++) {  //0 ~ weekCountに満たないまでの要素をdatesの0番目から7個ずつかぶらないように、spliceしてpushでweeksに入れる。
      weeks.push(dates.splice(0, 7));
    }


    weeks.forEach(week => {
      const tr = document.createElement('tr');
      week.forEach(date => {    //ここのdateはオブジェクト。
        const td = document.createElement('td');

        td.textContent = date.date;    //weekをforEachでその中身の日付をdateで受け取る。そうすると三つのプロパティがあるオブジェクトの日付をいじれる。その引数dateないのdateプロパティをtdのテキストにする。
        if (date.isToday) {       //引数dateのisTodayプロパティがtrueならば、tdにtodayクラスをつける。
          td.classList.add('today');
        }
        if (date.isDisabled) {    //引数dateのisDisabledプロパティがtrueならば、tdにdisabledクラスをつける。
          td.classList.add('disabled');
        }

        tr.appendChild(td);
      });
      document.querySelector('tbody').appendChild(tr);
    });
  }

  //カレンダー全体を作る。
  function createCalendar() {
    clearCalendar();    //画面の更新
    renderTitle();      //タイトルの更新
    renderWeeks();      //カレンダー全体の日付
  }

  //戻るボタン
  document.getElementById('prev').addEventListener('click', () => {
    month--;   //-1ずつ戻る
    if (month < 0) {    //もしmonthが0に満たない、つまり、1月に満たないとき、yearを-1ずつ減らし、monthを11にする。つまり12月にする。
      year--;
      month = 11;
    }

    createCalendar();            //戻るボタンを押したときも、カレンダー全体の構造を更新する。
  });


  //次に進むボタン
  document.getElementById('next').addEventListener('click', () => {
    month++;     //monthは+1ずつ増やす
    if (month > 11) {       //もし進んでいって、monthが11よりも大きくなる、つまり12月よりも大きなったら。
      year++;              //yearを+1ずつ増やす。
      month = 0;           //monthを0, つまり、1月にする。
    }

    createCalendar();
  });

  //カレンダー下部のtodayボタン
  document.getElementById('today').addEventListener('click', () => {

    year = today.getFullYear();       //今日の日付の年
    month = today.getMonth();        //今日の月
    createCalendar();               //カレンダー全体の処理
  });

  createCalendar();
}


