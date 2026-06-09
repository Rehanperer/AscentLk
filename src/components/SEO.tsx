import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    path: string;
    keywords?: string;
    ogImage?: string;
    noindex?: boolean;
    type?: string;
    jsonLd?: object;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    path,
    keywords = 'ASCENT 2026, Esports Sri Lanka, Student Gaming Tournament, Valorant Tournament, Sri Lanka Esports, Student Esports',
    ogImage = 'https://ascentlk.com/img/ASCENT2026-banner.jpg',
    noindex = false,
    type = 'website',
    jsonLd,
}) => {
    const url = `https://ascentlk.com${path}`;

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {noindex && <meta name="robots" content="noindex, nofollow" />}

            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
