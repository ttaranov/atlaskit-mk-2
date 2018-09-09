// @flow

import { createContext } from 'react';
import type { Experiments } from './types';

const initialContext: Experiments = {};
const Experiment = createContext(initialContext);

export const ExperimentProvider = Experiment.Provider;
export const ExperimentConsumer = Experiment.Consumer;
