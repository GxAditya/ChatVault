import Image from 'next/image';
import Link from 'next/link';
import { Download, Layers, Shield, Zap, FileText, CheckCircle, Github, Moon, Sun, Monitor } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">ChatVault</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
            <Link href="#platforms" className="hover:text-white transition-colors">Supported Platforms</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/Start-Ops-A-I-Pvt-Ltd/ChatVault"
              className="hidden sm:flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>Star on GitHub</span>
            </Link>
            <button className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-zinc-200 transition-colors">
              Get Extension
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute top-40 right-10 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-purple-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              v1.0 Now Available
            </div>

            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.1]">
              Your AI Chats, <br />
              <span className="text-gradient">Secure & Portable.</span>
            </h1>

            <p className="text-lg text-zinc-400 max-w-lg leading-relaxed">
              Export conversations from ChatGPT, Claude, Gemini, and more to perfectly formatted PDFs. Privacy-first, local processing, and beautiful typography.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="h-12 px-6 rounded-full bg-white text-black font-semibold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-transform active:scale-95">
                <Download className="w-4 h-4" />
                Add to Chrome
              </button>
              <button className="h-12 px-6 rounded-full border border-white/20 hover:bg-white/10 text-white font-semibold flex items-center justify-center gap-2 transition-all">
                <Download className="w-4 h-4" />
                Add to Firefox
              </button>
            </div>

            <div className="flex items-center gap-4 text-sm text-zinc-500">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-zinc-800" />
                ))}
              </div>
              <p>Trusted by 1000+ users</p>
            </div>
          </div>

          <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative z-10 rounded-2xl border border-white/10 shadow-2xl overflow-hidden glass-card">
              <Image
                src="/hero.png"
                alt="ChatVault Interface"
                width={1200}
                height={1200}
                className="w-full h-auto"
                priority
              />
            </div>
            {/* Decorative glows around image */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-20 -z-10" />
          </div>
        </div>
      </section>

      {/* Supported Platforms ticker or grid */}
      <section className="py-12 border-y border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm font-medium text-zinc-500 mb-8 uppercase tracking-wider">Supported Platforms</p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {['ChatGPT', 'Claude', 'Gemini', 'Z.AI', 'DeepSeek', 'Kimi'].map((platform) => (
              <div key={platform} className="text-xl font-semibold text-zinc-300 hover:text-white transition-colors cursor-default">
                {platform}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-3xl sm:text-5xl font-bold">Everything you need to archive chats</h2>
            <p className="text-zinc-400 text-lg">ChatVault preserves your conversations with the fidelity they deserve.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-green-400" />}
              title="Privacy First"
              description="All processing happens locally in your browser. Your chat data never leaves your device."
            />
            <FeatureCard
              icon={<FileText className="w-6 h-6 text-blue-400" />}
              title="Perfect Formatting"
              description="Preserves markdown, code blocks, tables, and mathematical equations with precision."
            />
            <FeatureCard
              icon={<Moon className="w-6 h-6 text-purple-400" />}
              title="Dark & Light Mode"
              description="Export PDFs in a theme that matches your preference or printing needs."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-yellow-400" />}
              title="AI Thinking Traces"
              description="Include or exclude the internal reasoning traces from AI models like Claude and DeepSeek."
            />
            <FeatureCard
              icon={<Monitor className="w-6 h-6 text-pink-400" />}
              title="Cross Browser"
              description="Native extensions available for both Chrome and Firefox browsers."
            />
            <FeatureCard
              icon={<Layers className="w-6 h-6 text-orange-400" />}
              title="Smart Detection"
              description="Automatically detects appropriate content selectors for each supported platform."
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-32 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl sm:text-5xl font-bold text-center mb-16">Export in 3 simple steps</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="01"
              title="Open Chat"
              description="Navigate to your favorite AI chat platform and open the conversation you want to save."
            />
            <StepCard
              number="02"
              title="Customise"
              description="Click the extension icon. Choose your theme, timestamps preference, and thinking trace options."
            />
            <StepCard
              number="03"
              title="Export"
              description="Hit 'Export to PDF'. You'll get a beautifully formatted document ready for archiving or sharing."
            />
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-20 border-t border-white/5 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 text-center space-y-8 relative z-10">
          <h2 className="text-4xl font-bold">Ready to secure your knowledge?</h2>
          <p className="text-zinc-400 max-w-xl mx-auto">Join thousands of researchers, developers, and writers who use ChatVault to archive their AI interactions.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="h-12 px-8 rounded-full bg-white text-black font-bold hover:bg-zinc-200 transition-colors">
              Download for Chrome
            </button>
            <button className="h-12 px-8 rounded-full bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition-colors border border-zinc-700">
              Download for Firefox
            </button>
          </div>

          <div className="pt-20 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-zinc-500">
            <p>© {new Date().getFullYear()} ChatVault. MIT License.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-white">Privacy</Link>
              <Link href="#" className="hover:text-white">Terms</Link>
              <Link href="https://github.com/Start-Ops-A-I-Pvt-Ltd/ChatVault" className="hover:text-white">GitHub</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-zinc-900/20 border border-white/5 hover:border-white/10 transition-colors group">
      <div className="mb-4 p-3 rounded-lg bg-white/5 w-fit group-hover:bg-white/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="relative p-8 rounded-3xl bg-gradient-to-b from-zinc-800/50 to-transparent border border-white/5">
      <span className="text-6xl font-bold text-white/5 absolute top-4 right-6 select-none">{number}</span>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-zinc-400">{description}</p>
    </div>
  )
}
