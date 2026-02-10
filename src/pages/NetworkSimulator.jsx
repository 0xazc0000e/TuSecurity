import React from 'react';
import { useNavigate } from 'react-router-dom';
import AttackSimulatorEngine from '../components/simulators/AttackSimulatorEngine';
import { networkIntrusionScenario } from '../data/attack-scenarios';

export default function NetworkSimulator() {
    const navigate = useNavigate();

    return (
        <AttackSimulatorEngine
            scenario={networkIntrusionScenario}
            onBack={() => navigate('/simulators')}
        />
    );
}
