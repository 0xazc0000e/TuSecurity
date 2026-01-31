import React from 'react';
import { ArticleCard } from '../components/ui/ArticleCard';
import { SectionHeader } from '../components/ui/SectionHeader';
import { MatrixBackground } from '../components/ui/MatrixBackground';

export default function Articles() {
    return (
        <div className="min-h-screen pt-24 px-6 relative">
            <MatrixBackground />
            <div className="max-w-7xl mx-auto">
                <SectionHeader title="المعرفة" subtitle="قاعدة المقالات" />
                <div className="grid md:grid-cols-3 gap-6">
                    <ArticleCard title="مستقبل الأمن السيبراني في عصر الذكاء الاصطناعي" date="2025-10-20" category="AI Security" delay={0} />
                    <ArticleCard title="تحليل ثغرات Zero-Day الأخيرة في أنظمة Linux" date="2025-10-18" category="Vulnerabilities" delay={0.2} />
                    <ArticleCard title="دليلك الكامل لشهادة OSCP واختبار الاختراق" date="2025-10-15" category="Career" delay={0.4} />
                    <ArticleCard title="كيف تحمي نفسك من الهندسة الاجتماعية؟" date="2025-10-10" category="Awareness" delay={0.6} />
                    <ArticleCard title="شرح بروتوكولات التشفير الحديثة (TLS 1.3)" date="2025-10-05" category="Crypto" delay={0.8} />
                </div>
            </div>
        </div>
    );
}
