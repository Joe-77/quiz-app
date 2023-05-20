let qNum = document.querySelector(".count span"),
  allSpan = document.querySelector(".all-span"),
  qTitle = document.querySelector(".question-title"),
  answers = document.querySelector(".answer-all"),
  submit = document.querySelector("button"),
  perfect = document.querySelector(".perfect");

var x = 0,
  correctAnswer = 0;

function getObj() {
  let myReq = new XMLHttpRequest();

  myReq.onreadystatechange = () => {
    if (myReq.readyState === 4 && myReq.status === 200) {
      let myObj = JSON.parse(myReq.responseText);
      let objLength = myObj.length;

      createSpan(objLength);
      addData(myObj[x], objLength);

      submit.addEventListener("click", () => {
        let rightAnswer = myObj[x].right_answer;

        x++;

        check(rightAnswer, objLength);

        qTitle.innerHTML = "";
        answers.innerHTML = "";
        addData(myObj[x], objLength);

        handleSpan();

        showResult(objLength);
      });
    }
  };

  myReq.open("GET", "question.json");
  myReq.send();
}

getObj();

function createSpan(num) {
  qNum.innerHTML = num;

  for (let i = 0; i < num; i++) {
    let mySpan = document.createElement("span");

    if (i === 0) {
      mySpan.className = "on";
    }

    allSpan.appendChild(mySpan);
  }
}

function addData(obj, count) {
  if (x < count) {
    let header = document.createElement("h2");
    let text = document.createTextNode(obj.title);
    header.appendChild(text);
    qTitle.appendChild(header);

    // create Answer

    for (let i = 0; i < 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.classList.add("answer");
      let inp = document.createElement("input");
      inp.type = "radio";
      inp.id = `answer_${i + 1}`;
      inp.name = "question";
      inp.dataset.answer = obj[`answer_${i + 1}`];

      if (i == 0) {
        inp.checked = true;
      }

      let label = document.createElement("label");
      label.htmlFor = `answer_${i + 1}`;

      let labelText = document.createTextNode(obj[`answer_${i + 1}`]);
      label.appendChild(labelText);

      mainDiv.appendChild(inp);
      mainDiv.appendChild(label);
      answers.appendChild(mainDiv);
    }
  }
}

function check(resultAnswer, count) {
  let answer = document.getElementsByName("question");
  let change;

  for (let i = 0; i < answer.length; i++) {
    if (answer[i].checked) {
      change = answer[i].dataset.answer;
    }
  }
  if (change === resultAnswer) {
    correctAnswer++;
  }
}

function handleSpan() {
  let Spans = document.querySelectorAll(".all-span span"),
    array = Array.from(Spans);

  array.forEach((s, n) => {
    if (x === n) {
      s.className = "on";
    }
  });
}

function showResult(num) {
  if (x === num) {
    submit.remove();
    qTitle.remove();
    answers.remove();
    allSpan.remove();

    if (correctAnswer > num / 2 && correctAnswer < num) {
      perfect.classList.add("mid");
      perfect.innerHTML = `well you got ${correctAnswer} out of ${num}`;
    } else if (correctAnswer === num) {
      perfect.classList.add("per");
      perfect.innerHTML = "Excellent, you got the full mark";
    } else {
      perfect.classList.add("bad");
      perfect.innerHTML = `You didn't pass the test,Try again.`;
    }
  }
}
