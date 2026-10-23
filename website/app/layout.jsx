import { Footer, Layout, Navbar } from 'nextra-theme-docs';
import { Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import { basePath, repository, siteUrl } from '../site.config.mjs';
import 'nextra-theme-docs/style.css';
import './style.css';

export const metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  title: {
    default: 'dotnet-ai-toolkit | Grounded workflows for .NET',
    template: '%s | dotnet-ai-toolkit'
  },
  description: 'Assistant-neutral .NET workflows, architecture templates, and evidence-driven verification for Copilot, Claude Code, Codex, Cursor, and OpenCode.',
  applicationName: 'dotnet-ai-toolkit',
  icons: { icon: `${basePath}/icon.svg` },
  openGraph: {
    type: 'website',
    siteName: 'dotnet-ai-toolkit',
    title: 'Grounded workflows for .NET development',
    description: 'Map ownership. Build focused features. Verify real behavior.'
  }
};

const navbar = (
  <Navbar
    logo={<span className="brand"><span className="brand-mark" aria-hidden="true">.ai</span><span>dotnet<span className="brand-muted">-ai-toolkit</span></span></span>}
    projectLink={repository}
  />
);

export default async function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head color={{ hue: 263, saturation: 75 }} />
      <body>
        <Layout
          navbar={navbar}
          footer={<Footer><span>dotnet-ai-toolkit<span className="footer-note">Original guidance. Evidence over assumptions.</span></span><a href={`${repository}/blob/main/LICENSE`}>MIT License</a></Footer>}
          pageMap={await getPageMap()}
          docsRepositoryBase={`${repository}/tree/main`}
          editLink={null}
          feedback={{ content: null }}
          sidebar={{ defaultMenuCollapseLevel: 1, autoCollapse: true }}
          toc={{ backToTop: 'Back to top' }}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
