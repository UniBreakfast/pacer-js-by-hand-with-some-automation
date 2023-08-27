const state = {
  phase: 'start',
  user: {},
  users: [],
  
}

const actions = [
  {
    name: 'list available actions',
    alwaysAvailable: true,
  },
  {
    name: 'get current phase',
    alwaysAvailable: true,
  },
  {
    name: 'advance the phase',
    alwaysAvailable: true,
  },
  {
    name: 'get user name',
    alwaysAvailable: true,
  },
  {
    name: 'get list of users',
    alwaysAvailable: true,
  },
  {
    name: 'switch user',
    alwaysAvailable: true,
  },
  {
    name: 'get starting confidence points requirements',
    alwaysAvailable: false,
  },
  {
    name: 'get starting confidence points',
    alwaysAvailable: true,
  },
  {
    name: 'set starting confidence points',
    alwaysAvailable: false,
  },
  {
    name: 'apply starting confidence points and begin game',
    alwaysAvailable: false,
  },
  {
    name: 'get activity name requirements',
    alwaysAvailable: false,
  },
  {
    name: 'get new activity name',
    alwaysAvailable: false,
  },
  {
    name: 'set new activity name',
    alwaysAvailable: false,
  },
  {
    name: 'get activity amount requirements',
    alwaysAvailable: false,
  },
  {
    name: 'get new activity amount',
    alwaysAvailable: false,
  },
  {
    name: 'set new activity amount',
    alwaysAvailable: false,
  },
  {
    name: 'get activity difficulty requirements',
    alwaysAvailable: false,
  },
  {
    name: 'get new activity difficulty',
    alwaysAvailable: false,
  },
  {
    name: 'set new activity difficulty',
    alwaysAvailable: false,
  },
  {
    name: 'add new activity',
    alwaysAvailable: false,
  },
  {
    name: 'get all activities',
    alwaysAvailable: false,
  },
  {
    name: 'get activity by id',
    alwaysAvailable: false,
  },
  {
    name: 'select activity',
    alwaysAvailable: false,
  },
  {
    name: 'get selected activity',
    alwaysAvailable: false,
  },
  {
    name: 'update selected activity name',
    alwaysAvailable: false,
  },
  {
    name: 'update selected activity amount',
    alwaysAvailable: false,
  },
]

const phases = {
  start: [
    'get starting confidence points requirements',
    'get starting confidence points',
    'set starting confidence points',
    'apply starting confidence points and begin game',
  ],
  learningActivities: [
    'get activity name requirements',
    'get new activity name',
    'set new activity name',
    'get activity amount requirements',
    'get new activity amount',
    'set new activity amount',
    'get activity difficulty requirements',
    'get new activity difficulty',
    'set new activity difficulty',
    'add new activity',
    'get all activities',
    'get activity by id',
    'select activity by id',
    'get selected activity',
    'update selected activity name',
    'update selected activity amount',
    'update selected activity difficulty',
    'delete selected activity',
    'archive selected activity',
    'get archived activities',
    'unarchive selected activity',
  ],
  learningQuests: [


  ],
}

const rules = {
  actions, phases,
}


function genId() {
  let id = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    id += chars.charAt(Math.floor(Math.random() * 62));
  }
  return id
}
