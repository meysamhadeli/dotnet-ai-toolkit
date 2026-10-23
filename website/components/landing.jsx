import Link from 'next/link';

const workflows = [
  ['01', 'Understand the system', 'Find the project shape, owning feature, registration path, and nearest test.', '/workflows/dotnet-map-system/', 'Map ownership'],
  ['02', 'Change the right boundary', 'Build a focused slice. Connect contracts, validation, persistence, and composition.', '/workflows/dotnet-add-feature-slice/', 'Build a feature'],
  ['03', 'Prove the behavior', 'Run the smallest meaningful check. Separate evidence from assumptions.', '/workflows/dotnet-verify/', 'Verify the change']
];

const shapes = [
  ['Class library', 'Public APIs. Direct dependencies. No artificial host.', 'class-library'],
  ['Modular monolith', 'One deployment. Explicit module ownership.', 'modular-monolith'],
  ['Monolith', 'Capability folders. One application boundary.', 'monolith'],
  ['Web API', 'HTTP semantics. Only the separation you need.', 'web-api'],
  ['Microservice', 'Independent deployment. Explicit contracts.', 'microservice']
];

function Arrow() {
  return <span aria-hidden="true">&rarr;</span>;
}

export function Landing() {
  return (
    <div className="landing">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <span className="eyebrow"><span className="status-dot" /> BUILT FOR .NET. NOT ONE ASSISTANT.</span>
          <h1 id="hero-title">Your codebase.<br />Your boundaries.<br /><span>Better AI workflows.</span></h1>
          <p className="hero-description">Give your assistant a practical path from understanding a .NET system to shipping a verified change. Grounded in your repository, not a one-size-fits-all scaffold.</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/getting-started/">Get started <Arrow /></Link>
            <Link className="button button-secondary" href="/workflows/">Explore workflows <Arrow /></Link>
          </div>
          <p className="hero-footnote">One-command skills install with Vercel. Node.js 22.20+. No .NET SDK required.</p>
        </div>
        <div className="workflow-window" aria-label="Example evidence-driven workflow">
          <div className="window-bar"><span className="window-dots" aria-hidden="true"><i /><i /><i /></span><span>feature / create-order</span><span className="window-tag">.NET</span></div>
          <div className="window-body">
            <p className="terminal-label">YOUR NEXT CHANGE</p>
            <p className="terminal-prompt"><span aria-hidden="true">&gt;</span> Use dotnet-map-system</p>
            <div className="evidence-list">
              <div><span className="evidence-line" /><span>Project shape</span><strong>Existing conventions</strong></div>
              <div><span className="evidence-line" /><span>Behavior owner</span><strong>Feature + boundary</strong></div>
              <div><span className="evidence-line" /><span>Commit path</span><strong>Trace, don&apos;t assume</strong></div>
              <div><span className="evidence-line" /><span>Regression check</span><strong>Nearest meaningful test</strong></div>
            </div>
            <div className="terminal-result"><span className="status-dot" /> Evidence first. Implementation second.</div>
          </div>
          <div className="window-bottom">Illustrative workflow, not an executed test result.</div>
        </div>
      </section>

      <section className="host-strip" aria-label="Supported assistants">
        <span>ONE TOOLKIT. FIVE HOSTS.</span>
        <div><span>GitHub Copilot</span><span>Claude Code</span><span>Codex</span><span>Cursor</span><span>OpenCode</span></div>
      </section>

      <section className="landing-section" aria-labelledby="workflow-title">
        <div className="section-heading"><span className="eyebrow">A WORKFLOW, NOT A PROMPT DUMP</span><h2 id="workflow-title">From context to confidence.</h2><p>Use one capability at a time. Keep ownership, implementation, and verification connected.</p></div>
        <div className="workflow-grid">
          {workflows.map(([number, title, description, href, label]) => (
            <Link className="workflow-card" href={href} key={number}>
              <span className="step-number">{number}</span><h3>{title}</h3><p>{description}</p><span className="card-link">{label} <Arrow /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="architecture-section" aria-labelledby="shape-title">
        <div className="section-heading"><span className="eyebrow">ARCHITECTURE THAT FITS</span><h2 id="shape-title">Not every project is a microservice.</h2><p>Choose the real project shape. Compose validation, endpoints, persistence, messaging, and testing only when needed.</p></div>
        <div className="shape-grid">
          {shapes.map(([title, description, slug]) => (
            <Link href={`/templates/${slug}/`} className="shape-card" key={slug}><span className="shape-icon" aria-hidden="true">&#123; &#125;</span><h3>{title}</h3><p>{description}</p><Arrow /></Link>
          ))}
        </div>
      </section>

      <section className="trust-panel" aria-labelledby="trust-title">
        <div><span className="eyebrow">CONTROL STAYS WITH YOU</span><h2 id="trust-title">Useful guidance.<br />Explicit boundaries.</h2><Link className="card-link" href="/guides/adoption/">Read the installation contract <Arrow /></Link></div>
        <ul><li><strong>Choose your setup.</strong> Vercel for skills; optional full installer for host instructions and roles.</li><li><strong>Review before accepting.</strong> Full setup refuses different files; Vercel uses its own installation policy.</li><li><strong>No hidden activation.</strong> No automatic hooks, MCP servers, or infrastructure changes.</li><li><strong>No invented guarantees.</strong> Static checks are not live assistant or .NET runtime results.</li></ul>
      </section>

      <section className="closing-section"><span className="eyebrow">START SMALL. VERIFY SOMETHING REAL.</span><h2>Make your next .NET change a grounded one.</h2><Link className="button button-primary" href="/getting-started/">Install the toolkit <Arrow /></Link><Link className="closing-link" href="/guides/first-workflow/">Walk through your first task <Arrow /></Link></section>
    </div>
  );
}
