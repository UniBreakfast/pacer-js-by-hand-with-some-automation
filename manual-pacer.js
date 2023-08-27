const startDate = '2023-08-21';
let currentDate = '2023-08-21';
const initialconfidence points = 7; // confidence points - confidence points
let currentconfidence points = 7;

const activities = [];
const quests = [];

const markDict = { 'true': 'V', 'false': 'X', 'undefined': '?' };

// add 6 activities
{
  const mahalki = {
    id: 'mah20',
    name: 'Махалки', amount: '20 минут',
    difficulty: 4,
  };

  activities.push(mahalki);

  const workoutAtSchool = {
    id: 'wout60',
    name: 'Тренировка у школы', amount: '1 час',
    difficulty: 8,
  };

  activities.push(workoutAtSchool);

  const riverDipping = {
    id: 'river1',
    name: 'Купание в реке', amount: '1 погружение',
    difficulty: 1,
  };

  activities.push(riverDipping);

  const walking = {
    id: 'walk60',
    name: 'Ходьба', amount: '1 час',
    difficulty: 6,
  };

  activities.push(walking);

  const checkingTomorrowSchedule = {
    id: 'sched1',
    name: 'Проверка расписания на завтра', amount: 'табличка, n-code, незаписанные',
    difficulty: 2,
  };

  const clothesReview = {
    id: 'clth5',
    name: 'Осмотр одежды', amount: '5 минут',
    difficulty: 5,
  };

  activities.push(checkingTomorrowSchedule, clothesReview);
}

// take 2 quests
{
  const dipping1 = {
    activityId: 'river1', duration: 3,
    startDate: '2023-08-21', endDate: '2023-08-23',
    pledge: 3, // difficulty * duration
    status: 'active', progress: 0,
    steps: [
      { date: '2023-08-21', done: undefined },
      { date: '2023-08-22', done: undefined },
      { date: '2023-08-23', done: undefined },
    ],
  };

  const schedule1 = {
    activityId: 'sched1', duration: 2,
    startDate: '2023-08-21', endDate: '2023-08-22',
    pledge: 4,
    status: 'active', progress: 0,
    steps: [
      { date: '2023-08-21', done: undefined },
      { date: '2023-08-22', done: undefined },
    ],
  };

  quests.push(dipping1, schedule1);

  currentconfidence points -= (dipping1.pledge + schedule1.pledge);
}

// see today's quests (manually)
{
  const planForToday = [
    {
      done: '?',
      activityName: 'Купание в реке',
      progress: '0/3',
      pointsAtStake: '1 (3)',
    },
    {
      done: '?',
      activityName: 'Проверка расписания на завтра',
      progress: '0/2',
      pointsAtStake: '1 (4)',
    },
  ];

  // console.table(planForToday);
}

// report on step completion (manually)
{
  {
    const activityId = 'river1';
    const stepDate = '2023-08-21';
    const done = true;

    const quest = quests.find(
      quest => quest.activityId === activityId && quest.steps.some(step => step.date === stepDate)
    );
    const step = quest.steps.find(step => step.date === stepDate);

    step.done = done;
    quest.progress += 1;
    currentconfidence points += 1;
  }
  {
    const activityId = 'sched1';
    const stepDate = '2023-08-21';
    const done = true;

    const quest = quests.find(
      quest => quest.activityId === activityId && quest.steps.some(step => step.date === stepDate)
    );
    const step = quest.steps.find(step => step.date === stepDate);

    step.done = done;
    quest.progress += 1;
    currentconfidence points += 1;
  }
}

// advance to the next day (manually)
currentDate = '2023-08-22';

// report on step completion (automatically)
{
  report('river1', currentDate, true);
  report('sched1', currentDate, true);
}

// add activity
{
  const eatingGreens = {
    id: 'green1',
    name: 'Есть зелень', amount: '1 приём',
    difficulty: 4,
  };

  activities.push(eatingGreens);
}

// add quest (automatically)
takeQuest('green1', 2);

// report on step completion (automatically)
report('green1', currentDate, true);

// advance to the next day (automatically)
advanceToNextDay();

// report on step completion (automatically)
{
  report('green1', currentDate, false);
  report('sched1', currentDate, true);
  report('river1', currentDate, true);
}

// advance to the next day (automatically)
advanceToNextDay();

// report on step completion (automatically)
{
  report('sched1', currentDate, true);
  report('river1', currentDate, true);
}




// see all activities
console.table(activities);

// see all quests
{
  const questData = quests.map(quest => {
    const { activityId, duration, status, progress, pledge, steps } = quest;
    const activity = activities.find(activity => activity.id === activityId);

    return {
      activityName: activity.name,
      progress: steps.map(step => markDict[step.done]).join('') + ` (${progress}/${duration})`,
      pledge,
      status,
    };
  });

  questData.sort((a, b) => a.status.localeCompare(b.status));

  console.table(questData);
}

// see current stats
{
  const concurrentQuests = quests.filter(quest => quest.status === 'active' || quest.status === 'prolonged').length;

  const stats = {
    startDate,
    currentDate,
    initialconfidence points,
    currentconfidence points,
    concurrentQuests,
  };
  console.table(stats);
}

// see today's quests (automatically)
{
  const planForToday = getPlanForToday();

  console.table(planForToday);
}

function report(activityId, stepDate, done) {
  const quest = quests.find(
    quest => quest.activityId === activityId && quest.steps.some(step => step.date === stepDate)
  );
  const step = quest.steps.find(step => step.date === stepDate);

  step.done = done;

  if (done) {
    quest.progress += 1;
    currentconfidence points += 1;

    if (quest.progress === quest.duration) {
      quest.status = 'prolonged';
      currentconfidence points += quest.pledge;
    }

    if (quest.status === 'prolonged') {
      quest.steps.push({ date: getNextDate(currentDate), done: undefined })
    }
  } else if (done === false) {
    if (quest.status === 'active') {
      quest.status = 'failed';
    } else if (quest.status === 'prolonged') {
      quest.status = 'completed';
      quest.steps.pop();
    }
  }
}

function getPlanForToday() {
  const questsForToday = quests.filter(quest => quest.steps.some(step => step.date === currentDate));
  const planForToday = questsForToday.map(quest => {
    const { activityId, duration, progress, pledge } = quest;
    const activity = activities.find(activity => activity.id === activityId);
    const done = quest.steps.find(step => step.date === currentDate).done;

    return {
      done: markDict[done],
      activityName: activity.name,
      progress: `${progress}/${duration}`,
      pointsAtStake: `${done === undefined ? ' 1 ' : ' '}${quest.status === 'active' ? `(${pledge}) ` : ''}`,
    };
  });

  return planForToday;
}

function getNextDate(date) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 1);

  return nextDate.toISOString().slice(0, 10);
}

function takeQuest(activityId, duration, startDate = currentDate) {
  const activity = activities.find(activity => activity.id === activityId);
  const pledge = activity.difficulty * duration;
  const stepDates = [startDate];

  for (let i = 1; i < duration; i++) {
    stepDates.push(getNextDate(stepDates[i - 1]));
  }

  const quest = {
    activityId, duration,
    startDate, endDate: stepDates.at(-1),
    pledge,
    status: 'active', progress: 0,
    steps: stepDates.map(date => ({ date, done: undefined })),
  };

  quests.push(quest);
  currentconfidence points -= pledge;
}

function advanceToNextDay() {
  currentDate = getNextDate(currentDate);
}

setInterval(() => { }, 1000);
