const STORAGE_KEY = "leakInvestigationStateV1";

const defaultState = {
  unlocked: {
    landing: true,
    documents: true,
    graph: false,
    location: false,
    debate: false,
    conclusion: false,
    references: true
  },
  progress: {
    documentsSolved: false,
    graphSolved: false,
    locationSolved: false,
    debateFinished: false
  },
  choices: {
    suspectDocument: null,
    insiderNode: null,
    homeGuess: null,
    workGuess: null
  }
};

function getState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
    return structuredClone(defaultState);
  }
  try {
    return { ...defaultState, ...JSON.parse(raw) };
  } catch (err) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
    return structuredClone(defaultState);
  }
}

function saveState(nextState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
}

function updateState(mutator) {
  const state = getState();
  mutator(state);
  saveState(state);
}

function markSolved(sectionName) {
  updateState((state) => {
    if (sectionName === "documents") {
      state.progress.documentsSolved = true;
      state.unlocked.graph = true;
    }
    if (sectionName === "graph") {
      state.progress.graphSolved = true;
      state.unlocked.location = true;
    }
    if (sectionName === "location") {
      state.progress.locationSolved = true;
      state.unlocked.debate = true;
    }
    if (sectionName === "debate") {
      state.progress.debateFinished = true;
      state.unlocked.conclusion = true;
    }
  });
}

function resetInvestigation() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
}

function ensureUnlocked(section) {
  const state = getState();
  return !!state.unlocked[section];
}
