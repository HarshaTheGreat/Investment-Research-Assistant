import { useState } from 'react';
import { ArticleView } from './components/ArticleView';
import { CompanyDashboard } from './components/CompanyDashboard';
import { ComparisonView } from './components/ComparisonView';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { AppRoute, Navbar } from './components/Navbar';
import { NewsView } from './components/NewsView';
import { ProjectionsView } from './components/ProjectionsView';
import { ResearchAssistantDrawer } from './components/ResearchAssistantDrawer';
import { TickerSymbol } from './types/financial';

export default function App() {
  const [activeRoute, setActiveRoute] = useState<AppRoute>('home');
  const [selectedTicker, setSelectedTicker] = useState<TickerSymbol>('AMD');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantInitialPrompt, setAssistantInitialPrompt] = useState<string | null>(null);
  const [assistantContextTicker, setAssistantContextTicker] = useState<TickerSymbol | undefined>(undefined);

  const handleSelectCompany = (ticker: TickerSymbol) => {
    setSelectedTicker(ticker);
    setSelectedArticleId(null);
    setActiveRoute('company');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (route: AppRoute) => {
    setSelectedArticleId(null);
    setActiveRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenArticle = (articleId: string) => {
    setSelectedArticleId(articleId);
    setActiveRoute('news');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAskTutor = (prompt?: string, ticker?: TickerSymbol) => {
    setAssistantContextTicker(ticker ?? (activeRoute === 'company' ? selectedTicker : undefined));
    if (prompt) {
      setAssistantInitialPrompt(prompt);
    }
    setAssistantOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      <Navbar
        activeRoute={activeRoute}
        onNavigate={handleNavigate}
        onOpenAssistant={() => handleAskTutor()}
      />

      <div className="flex-1">
        {activeRoute === 'home' && (
          <HomeView
            onSelectCompany={handleSelectCompany}
            onNavigate={handleNavigate}
            onOpenArticle={handleOpenArticle}
            onAskTutor={handleAskTutor}
          />
        )}

        {activeRoute === 'company' && (
          <CompanyDashboard
            ticker={selectedTicker}
            onSelectCompany={handleSelectCompany}
            onBackHome={() => handleNavigate('home')}
            onOpenArticle={handleOpenArticle}
            onAskTutor={handleAskTutor}
          />
        )}

        {activeRoute === 'compare' && (
          <ComparisonView
            onSelectCompany={handleSelectCompany}
            onAskTutor={(prompt) => handleAskTutor(prompt)}
          />
        )}

        {activeRoute === 'projections' && (
          <ProjectionsView
            onSelectCompany={handleSelectCompany}
            onAskTutor={handleAskTutor}
          />
        )}

        {activeRoute === 'news' && selectedArticleId && (
          <ArticleView
            articleId={selectedArticleId}
            onBackToNews={() => setSelectedArticleId(null)}
            onOpenArticle={handleOpenArticle}
            onSelectCompany={handleSelectCompany}
            onAskTutor={handleAskTutor}
          />
        )}

        {activeRoute === 'news' && !selectedArticleId && (
          <NewsView onOpenArticle={handleOpenArticle} />
        )}
      </div>

      <Footer
        onNavigate={handleNavigate}
        onSelectCompany={handleSelectCompany}
      />

      <ResearchAssistantDrawer
        isOpen={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        activeTicker={assistantContextTicker}
        initialPrompt={assistantInitialPrompt}
        onClearInitialPrompt={() => setAssistantInitialPrompt(null)}
      />
    </div>
  );
}
