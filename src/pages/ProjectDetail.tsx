import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Github, ExternalLink, Star, GitFork, Eye,
  Code, CircleDot, GitPullRequest, Play, Shield, Book,
  Settings, Folder, FileText, Clock, GitCommit, GitBranch,
  Tag, Copy, ChevronDown, Link as LinkIcon, Search,
  AlertCircle, Users, Package, BarChart3
} from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { projects } from '@/data/projects';

// Language colors matching GitHub's language colors
const languageColors: Record<string, string> = {
  'Python': '#3572A5',
  'Flask': '#3572A5',
  'JavaScript': '#f1e05a',
  'TypeScript': '#3178c6',
  'Node.js': '#f1e05a',
  'Express': '#f1e05a',
  'HTML': '#e34c26',
  'CSS': '#563d7c',
  'Shell': '#89e051',
  'Dockerfile': '#384d54',
  'Docker': '#384d54',
  'HCL': '#844FBA',
  'Terraform': '#844FBA',
  'YAML': '#cb171e',
  'Kubernetes': '#326CE5',
  'Helm': '#0F1689',
  'Jenkins': '#D24939',
  'Jenkinsfile': '#D24939',
  'MySQL': '#4479A1',
  'Go': '#00ADD8',
  'Makefile': '#427819',
  'AWS': '#FF9900',
  'Groovy': '#4298b8',
};

// Simulated file structures for each project
const projectFiles: Record<string, Array<{ name: string; type: 'folder' | 'file'; lastCommit: string; time: string }>> = {
  'two-tier-flaskapp': [
    { name: 'eks-manifests', type: 'folder', lastCommit: 'Add EKS deployment manifests', time: '3 months ago' },
    { name: 'k8s', type: 'folder', lastCommit: 'Update Kubernetes configs', time: '3 months ago' },
    { name: 'templates', type: 'folder', lastCommit: 'Update Flask templates', time: '3 months ago' },
    { name: '.dockerignore', type: 'file', lastCommit: 'Add Docker configuration', time: '4 months ago' },
    { name: 'Dockerfile', type: 'file', lastCommit: 'Optimize multi-stage build', time: '3 months ago' },
    { name: 'Jenkinsfile', type: 'file', lastCommit: 'Add CI/CD pipeline config', time: '3 months ago' },
    { name: 'README.md', type: 'file', lastCommit: 'Update documentation', time: '3 months ago' },
    { name: 'app.py', type: 'file', lastCommit: 'Fix MySQL connection handler', time: '3 months ago' },
    { name: 'docker-compose.yml', type: 'file', lastCommit: 'Add compose configuration', time: '4 months ago' },
    { name: 'message.sql', type: 'file', lastCommit: 'Initial database schema', time: '4 months ago' },
    { name: 'requirements.txt', type: 'file', lastCommit: 'Update dependencies', time: '3 months ago' },
  ],
  'nodejs-todo-cicd': [
    { name: '.github', type: 'folder', lastCommit: 'Add GitHub Actions workflow', time: '2 months ago' },
    { name: 'terraform', type: 'folder', lastCommit: 'Add IaC configurations', time: '2 months ago' },
    { name: 'src', type: 'folder', lastCommit: 'Refactor app structure', time: '2 months ago' },
    { name: 'tests', type: 'folder', lastCommit: 'Add unit tests', time: '2 months ago' },
    { name: '.dockerignore', type: 'file', lastCommit: 'Add Docker config', time: '3 months ago' },
    { name: 'Dockerfile', type: 'file', lastCommit: 'Add multi-stage Docker build', time: '2 months ago' },
    { name: 'Jenkinsfile', type: 'file', lastCommit: 'Configure Jenkins pipeline', time: '2 months ago' },
    { name: 'README.md', type: 'file', lastCommit: 'Update project documentation', time: '2 months ago' },
    { name: 'package.json', type: 'file', lastCommit: 'Update dependencies', time: '2 months ago' },
    { name: 'server.js', type: 'file', lastCommit: 'Fix Express routing', time: '2 months ago' },
  ],
  'scalable-aws-kubernetes': [
    { name: 'helm-charts', type: 'folder', lastCommit: 'Add Helm chart templates', time: '4 months ago' },
    { name: 'terraform', type: 'folder', lastCommit: 'Configure EKS cluster', time: '4 months ago' },
    { name: 'k8s-manifests', type: 'folder', lastCommit: 'Add deployment manifests', time: '4 months ago' },
    { name: 'monitoring', type: 'folder', lastCommit: 'Add Prometheus configs', time: '4 months ago' },
    { name: 'scripts', type: 'folder', lastCommit: 'Add deployment scripts', time: '5 months ago' },
    { name: '.gitignore', type: 'file', lastCommit: 'Initial commit', time: '5 months ago' },
    { name: 'Makefile', type: 'file', lastCommit: 'Add build automation', time: '4 months ago' },
    { name: 'README.md', type: 'file', lastCommit: 'Update architecture docs', time: '4 months ago' },
    { name: 'values.yaml', type: 'file', lastCommit: 'Configure Helm values', time: '4 months ago' },
  ],
  'cost-efficient-cicd': [
    { name: 'lambda-functions', type: 'folder', lastCommit: 'Add Lambda automation scripts', time: '3 months ago' },
    { name: 'terraform', type: 'folder', lastCommit: 'Add infrastructure code', time: '3 months ago' },
    { name: 'jenkins-pipelines', type: 'folder', lastCommit: 'Optimize pipeline configs', time: '3 months ago' },
    { name: 'cloudwatch-dashboards', type: 'folder', lastCommit: 'Add monitoring dashboards', time: '4 months ago' },
    { name: '.gitignore', type: 'file', lastCommit: 'Initial commit', time: '4 months ago' },
    { name: 'Jenkinsfile', type: 'file', lastCommit: 'Add pipeline definition', time: '3 months ago' },
    { name: 'README.md', type: 'file', lastCommit: 'Update cost analysis docs', time: '3 months ago' },
    { name: 'deploy.sh', type: 'file', lastCommit: 'Add deployment script', time: '3 months ago' },
    { name: 'requirements.txt', type: 'file', lastCommit: 'Add Python dependencies', time: '3 months ago' },
  ],
};

// Simulated language distributions
const projectLanguages: Record<string, Array<{ name: string; percentage: number }>> = {
  'two-tier-flaskapp': [
    { name: 'Python', percentage: 45.2 },
    { name: 'Dockerfile', percentage: 18.7 },
    { name: 'HTML', percentage: 15.3 },
    { name: 'YAML', percentage: 12.1 },
    { name: 'Shell', percentage: 5.4 },
    { name: 'Groovy', percentage: 3.3 },
  ],
  'nodejs-todo-cicd': [
    { name: 'JavaScript', percentage: 42.8 },
    { name: 'HCL', percentage: 24.5 },
    { name: 'Dockerfile', percentage: 14.2 },
    { name: 'YAML', percentage: 10.6 },
    { name: 'Shell', percentage: 7.9 },
  ],
  'scalable-aws-kubernetes': [
    { name: 'HCL', percentage: 38.4 },
    { name: 'YAML', percentage: 28.7 },
    { name: 'Python', percentage: 16.2 },
    { name: 'Shell', percentage: 10.4 },
    { name: 'Makefile', percentage: 6.3 },
  ],
  'cost-efficient-cicd': [
    { name: 'Python', percentage: 35.6 },
    { name: 'HCL', percentage: 26.3 },
    { name: 'Groovy', percentage: 18.8 },
    { name: 'Shell', percentage: 11.2 },
    { name: 'YAML', percentage: 8.1 },
  ],
};

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('code');
  const [copiedUrl, setCopiedUrl] = useState(false);

  const project = projects.find(p => p.slug === slug);

  const files = useMemo(() => projectFiles[slug || ''] || [], [slug]);
  const languages = useMemo(() => projectLanguages[slug || ''] || [], [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const goToSection = (sectionId: string) => {
    navigate('/#' + sectionId);
  };

  const copyCloneUrl = () => {
    if (project?.github && project.github !== '#') {
      navigator.clipboard.writeText(`git clone ${project.github}.git`);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground">Project Not Found</h1>
            <p className="mt-4 text-muted-foreground">The project you're looking for doesn't exist.</p>
            <button onClick={() => goToSection('projects')} className="btn-primary mt-6">
              Back to Projects
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const tabs = [
    { id: 'code', icon: Code, label: 'Code' },
    { id: 'issues', icon: CircleDot, label: 'Issues', count: 0 },
    { id: 'pulls', icon: GitPullRequest, label: 'Pull requests', count: 0 },
    { id: 'actions', icon: Play, label: 'Actions' },
    { id: 'security', icon: Shield, label: 'Security' },
    { id: 'insights', icon: BarChart3, label: 'Insights' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-[hsl(222,47%,4%)]">
      {/* ───────── Top Navigation Bar ───────── */}
      <div className="border-b border-[hsl(217,33%,14%)] bg-[hsl(222,47%,7%)]">
        <div className="mx-auto max-w-[1280px] px-4 py-4 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            {/* Back + Breadcrumb */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => goToSection('projects')}
                className="flex items-center gap-1.5 rounded-md border border-[hsl(217,33%,17%)] bg-[hsl(222,47%,10%)] px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-primary/40 hover:text-primary"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Portfolio</span>
              </button>
              <div className="flex items-center gap-1.5 text-sm">
                <Book className="h-4 w-4 text-muted-foreground" />
                <button
                  onClick={() => goToSection('projects')}
                  className="font-semibold text-primary hover:underline"
                >
                  Hemanshubt
                </button>
                <span className="text-muted-foreground">/</span>
                <button
                  onClick={() => window.scrollTo(0, 0)}
                  className="font-bold text-primary hover:underline"
                >
                  {project.slug}
                </button>
                <span className="ml-2 rounded-full border border-[hsl(217,33%,20%)] px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  Public
                </span>
              </div>
            </div>

            {/* Action Buttons (Star, Fork, Watch) */}
            <div className="hidden items-center gap-2 sm:flex">
              {/* Watch */}
              <div className="flex items-center overflow-hidden rounded-md border border-[hsl(217,33%,17%)]">
                <button className="flex items-center gap-1.5 bg-[hsl(222,47%,10%)] px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-[hsl(222,47%,13%)]">
                  <Eye className="h-3.5 w-3.5" />
                  Watch
                </button>
                <span className="border-l border-[hsl(217,33%,17%)] bg-[hsl(222,47%,8%)] px-2.5 py-1.5 text-xs font-semibold text-foreground">
                  1
                </span>
              </div>
              {/* Fork */}
              <div className="flex items-center overflow-hidden rounded-md border border-[hsl(217,33%,17%)]">
                <button className="flex items-center gap-1.5 bg-[hsl(222,47%,10%)] px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-[hsl(222,47%,13%)]">
                  <GitFork className="h-3.5 w-3.5" />
                  Fork
                </button>
                <span className="border-l border-[hsl(217,33%,17%)] bg-[hsl(222,47%,8%)] px-2.5 py-1.5 text-xs font-semibold text-foreground">
                  0
                </span>
              </div>
              {/* Star */}
              <div className="flex items-center overflow-hidden rounded-md border border-[hsl(217,33%,17%)]">
                <button className="flex items-center gap-1.5 bg-[hsl(222,47%,10%)] px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-[hsl(222,47%,13%)]">
                  <Star className="h-3.5 w-3.5" />
                  Star
                </button>
                <span className="border-l border-[hsl(217,33%,17%)] bg-[hsl(222,47%,8%)] px-2.5 py-1.5 text-xs font-semibold text-foreground">
                  1
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ───────── Tab Navigation ───────── */}
      <div className="border-b border-[hsl(217,33%,14%)] bg-[hsl(222,47%,7%)]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
          <nav className="scrollbar-hide -mb-px flex gap-0 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors
                  ${activeTab === tab.id
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:border-[hsl(217,33%,25%)] hover:text-foreground'
                  }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none
                    ${activeTab === tab.id
                      ? 'bg-primary/20 text-primary'
                      : 'bg-[hsl(217,33%,17%)] text-muted-foreground'
                    }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* ───────── Main Content Area ───────── */}
      <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-8 sm:py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">

          {/* ═══════ Left Column ═══════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="min-w-0"
          >
            {/* Branch / Clone Section */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 rounded-md border border-[hsl(217,33%,17%)] bg-[hsl(222,47%,10%)] px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-[hsl(222,47%,13%)]">
                  <GitBranch className="h-3.5 w-3.5" />
                  main
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </button>
                <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                  <GitBranch className="h-3.5 w-3.5" />
                  <span className="font-semibold text-foreground">1</span> branch
                </span>
                <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                  <Tag className="h-3.5 w-3.5" />
                  <span className="font-semibold text-foreground">0</span> tags
                </span>
              </div>

              <div className="flex items-center gap-2">
                {project.github !== '#' && (
                  <button
                    onClick={copyCloneUrl}
                    className="flex items-center gap-1.5 rounded-md border border-[hsl(217,33%,17%)] bg-[hsl(222,47%,10%)] px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-[hsl(222,47%,13%)]"
                  >
                    {copiedUrl ? (
                      <>
                        <span className="text-secondary">✓</span>
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Clone
                      </>
                    )}
                  </button>
                )}
                <button className="flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-xs font-semibold text-background transition-opacity hover:opacity-90">
                  <Code className="h-3.5 w-3.5" />
                  Code
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* ── File Browser Table ── */}
            <div className="overflow-hidden rounded-lg border border-[hsl(217,33%,14%)]">
              {/* Commit Bar */}
              <div className="flex items-center gap-3 border-b border-[hsl(217,33%,14%)] bg-[hsl(222,47%,9%)] px-4 py-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
                  <span className="text-[10px] font-bold text-primary">H</span>
                </div>
                <span className="text-sm font-semibold text-foreground">Hemanshubt</span>
                <span className="hidden truncate text-sm text-muted-foreground sm:inline">
                  Update project documentation
                </span>
                <div className="ml-auto flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                  <span className="hidden items-center gap-1 sm:flex">
                    <GitCommit className="h-3.5 w-3.5" />
                    <span className="font-mono text-foreground">a3b8d1b</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    3 months ago
                  </span>
                  <span className="hidden items-center gap-1.5 rounded-md border border-[hsl(217,33%,17%)] px-2 py-0.5 sm:flex">
                    <GitCommit className="h-3 w-3" />
                    <span className="font-semibold text-foreground">{files.length}</span> commits
                  </span>
                </div>
              </div>

              {/* File Rows */}
              <div className="divide-y divide-[hsl(217,33%,12%)]">
                {files.map((file, i) => (
                  <motion.div
                    key={file.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="group flex items-center gap-3 px-4 py-2 transition-colors hover:bg-[hsl(222,47%,8%)]"
                  >
                    {file.type === 'folder' ? (
                      <Folder className="h-4 w-4 shrink-0 text-primary/70" />
                    ) : (
                      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className={`min-w-0 truncate text-sm ${file.type === 'folder'
                        ? 'font-medium text-primary hover:underline'
                        : 'text-foreground group-hover:text-primary'
                      }`}>
                      {file.name}
                    </span>
                    <span className="ml-auto hidden truncate text-xs text-muted-foreground sm:inline sm:max-w-[200px] md:max-w-[300px]">
                      {file.lastCommit}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {file.time}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ── README.md Section ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 overflow-hidden rounded-lg border border-[hsl(217,33%,14%)]"
            >
              {/* README Header */}
              <div className="flex items-center gap-2 border-b border-[hsl(217,33%,14%)] bg-[hsl(222,47%,9%)] px-4 py-3">
                <Book className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">README.md</span>
              </div>

              {/* README Content */}
              <div className="bg-[hsl(222,47%,6%)] p-6 sm:p-8">
                {/* Project Title */}
                <div className="mb-6 border-b border-[hsl(217,33%,14%)] pb-4">
                  <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground sm:text-3xl">
                    <project.icon className={`h-7 w-7 ${project.color === 'primary' ? 'text-primary' : 'text-secondary'}`} />
                    {project.title}
                  </h1>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.highlights.map((highlight, i) => (
                      <span
                        key={i}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${project.color === 'primary'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-secondary/10 text-secondary'
                          }`}
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Overview */}
                <div className="mb-8">
                  <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                    <span className="text-primary">##</span> Overview
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {project.readme.overview}
                  </p>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                    <span className="text-primary">##</span> Key Features
                  </h2>
                  <ul className="space-y-2.5">
                    {project.readme.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground sm:text-base">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Architecture - Terminal Style */}
                <div className="mb-8">
                  <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                    <span className="text-primary">##</span> Architecture
                  </h2>
                  <div className="overflow-hidden rounded-lg border border-[hsl(217,33%,12%)] bg-[hsl(222,47%,4%)]">
                    <div className="flex items-center gap-2 border-b border-[hsl(217,33%,12%)] px-4 py-2.5">
                      <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                      <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                      <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                      <span className="ml-3 font-mono text-xs text-muted-foreground">architecture.md</span>
                    </div>
                    <div className="p-4">
                      <ul className="space-y-2">
                        {project.readme.architecture.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 font-mono text-xs text-foreground sm:text-sm">
                            <span className="text-secondary">→</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="mb-4">
                  <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                    <span className="text-primary">##</span> Tech Stack
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {project.readme.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="rounded-md border border-[hsl(217,33%,17%)] bg-[hsl(222,47%,8%)] px-3 py-1.5 font-mono text-xs text-foreground transition-all hover:border-primary/40 hover:bg-primary/5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ═══════ Right Sidebar ═══════ */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-6"
          >
            {/* About Card */}
            <div className="rounded-lg border border-[hsl(217,33%,14%)] bg-[hsl(222,47%,6%)] p-5">
              <h3 className="mb-3 text-sm font-semibold text-foreground">About</h3>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>

              {project.github !== '#' && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-4 flex items-center gap-2 text-sm text-primary transition-opacity hover:opacity-80"
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                  <span className="truncate">{project.github.replace('https://', '')}</span>
                </a>
              )}

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-5 space-y-3 border-t border-[hsl(217,33%,14%)] pt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Book className="h-4 w-4" />
                  <span>Readme</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span className="font-semibold text-foreground">1</span> star
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span className="font-semibold text-foreground">1</span> watching
                </div>
                <div className="flex items-center gap-2">
                  <GitFork className="h-4 w-4" />
                  <span className="font-semibold text-foreground">0</span> forks
                </div>
              </div>
            </div>

            {/* Releases */}
            <div className="rounded-lg border border-[hsl(217,33%,14%)] bg-[hsl(222,47%,6%)] p-5">
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                Releases
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag className="h-4 w-4" />
                <span>No releases published</span>
              </div>
            </div>

            {/* Packages */}
            <div className="rounded-lg border border-[hsl(217,33%,14%)] bg-[hsl(222,47%,6%)] p-5">
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                Packages
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>No packages published</span>
              </div>
            </div>

            {/* Contributors */}
            <div className="rounded-lg border border-[hsl(217,33%,14%)] bg-[hsl(222,47%,6%)] p-5">
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                Contributors
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-xs font-bold text-background">
                  H
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Hemanshubt</p>
                  <p className="text-xs text-muted-foreground">DevOps Engineer</p>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="rounded-lg border border-[hsl(217,33%,14%)] bg-[hsl(222,47%,6%)] p-5">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Languages</h3>

              {/* Language Bar */}
              <div className="mb-4 flex h-2 overflow-hidden rounded-full">
                {languages.map((lang, i) => (
                  <div
                    key={i}
                    style={{
                      width: `${lang.percentage}%`,
                      backgroundColor: languageColors[lang.name] || '#8b949e',
                    }}
                    className="transition-all duration-500 hover:opacity-80 first:rounded-l-full last:rounded-r-full"
                    title={`${lang.name} ${lang.percentage}%`}
                  />
                ))}
              </div>

              {/* Language List */}
              <div className="space-y-2">
                {languages.map((lang, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: languageColors[lang.name] || '#8b949e' }}
                      />
                      <span className="font-medium text-foreground">{lang.name}</span>
                    </div>
                    <span className="text-muted-foreground">{lang.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              {project.github !== '#' && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-[hsl(217,33%,17%)] bg-[hsl(222,47%,10%)] px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:bg-[hsl(222,47%,13%)]"
                >
                  <Github className="h-4 w-4" />
                  View on GitHub
                </a>
              )}
              <button
                onClick={() => goToSection('contact')}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-background transition-all hover:shadow-[0_0_20px_hsl(191,100%,50%,0.3)]"
              >
                <ExternalLink className="h-4 w-4" />
                Contact Me
              </button>
            </div>
          </motion.aside>
        </div>
      </div>

      {/* ───────── CTA Section ───────── */}
      <section className="border-t border-[hsl(217,33%,14%)] bg-[hsl(222,47%,5%)] py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Interested in this project?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Let's discuss how I can bring similar solutions to your team.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button onClick={() => goToSection('contact')} className="btn-primary">
                Get in Touch
              </button>
              <button onClick={() => goToSection('projects')} className="btn-outline">
                View More Projects
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
