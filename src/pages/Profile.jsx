import React from 'react';
import { MatrixBackground } from '../components/ui/MatrixBackground';

import { CognitiveDashboard } from '../components/profile/CognitiveDashboard';
import { SimulationHistory } from '../components/profile/SimulationHistory';
import { SkillRelationshipMap } from '../components/profile/SkillRelationshipMap';
import { LearningJournal } from '../components/profile/LearningJournal';
import { LearningStyleAwareness } from '../components/profile/LearningStyleAwareness';
import { EthicalIndicator } from '../components/profile/EthicalIndicator';
import { PersonalizedPath } from '../components/profile/PersonalizedPath';
import { IdentitySection } from '../components/profile/IdentitySection';

export default function Profile() {
    return (
        <div className="min-h-screen pt-24 px-6 relative pb-12">
            <MatrixBackground />

            <div className="max-w-7xl mx-auto">
                {/* 1. Identity Header */}
                <IdentitySection />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Column (Center & Right) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* 2. Cognitive Dashboard */}
                        <CognitiveDashboard />

                        {/* 3. Skill Map */}
                        <div className="h-[450px]">
                            <SkillRelationshipMap />
                        </div>

                        {/* 4. History */}
                        <SimulationHistory />
                    </div>

                    {/* Sidebar Column (Left) */}
                    <div className="space-y-8 h-full flex flex-col">
                        {/* 7. Ethical Balance */}
                        <div className="flex-1">
                            <EthicalIndicator />
                        </div>

                        {/* 8. Next Steps */}
                        <div className="flex-1">
                            <PersonalizedPath />
                        </div>

                        {/* 5. Style Awareness */}
                        <div className="flex-1">
                            <LearningStyleAwareness />
                        </div>

                        {/* 6. Journal */}
                        <div className="flex-[2]">
                            <LearningJournal />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
