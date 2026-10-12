import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Activities from "@/components/Activities";
import Means from "@/components/Means";
import Portfolio from "@/components/Portfolio";
import Clients from "@/components/Clients";
import Quality from "@/components/Quality";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SocialFloat from "@/components/SocialFloat";
import SectionDivider from "@/components/SectionDivider";
import { SiteContentProvider } from "@/components/SiteContentProvider";
import { getSiteContent } from "@/lib/site-content-server";
import { getCatalogProjects, getCatalogReports } from "@/lib/catalog-server";
import { getSiteClients } from "@/lib/clients-server";
import { getPublicImageAssetMap } from "@/lib/image-assets-server";
import { getPublicActivities } from "@/lib/activities-content-server";
import { getQualityContent } from "@/lib/quality-content-server";
import { getMeansContent } from "@/lib/means-content-server";

export default async function Home() {
  const [
    content,
    projects,
    reports,
    clients,
    imageAssets,
    activities,
    quality,
    means,
  ] = await Promise.all([
    getSiteContent(),
    getCatalogProjects(),
    getCatalogReports(),
    getSiteClients(),
    getPublicImageAssetMap(),
    getPublicActivities(),
    getQualityContent(),
    getMeansContent(),
  ]);

  return (
    <SiteContentProvider value={content}>
      <div className="site-shell min-h-screen">
        <Header />
        <main>
          <Hero chantierCount={projects.length} />
          <SectionDivider />
          <About />
          <SectionDivider />
          <Activities activitiesContent={activities} imageOverrides={imageAssets} />
          <SectionDivider />
          <Means content={means} />
          <SectionDivider />
          <Portfolio projects={projects} />
          <SectionDivider />
          <Clients clients={clients} projects={projects} reports={reports} />
          <SectionDivider />
          <Quality content={quality} />
          <SectionDivider />
          <Contact />
        </main>
        <Footer />
        <SocialFloat />
      </div>
    </SiteContentProvider>
  );
}
