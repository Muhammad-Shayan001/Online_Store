import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  keywords?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title = 'Online Store - Premium Shopping', 
  description = 'Curating the finest products for discerning tastes.', 
  image = '/logo.png',
  keywords = 'shopping, premium, luxury, online store'
}) => {
  const siteUrl = window.location.origin;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* OpenGraph Metadata (Facebook, LinkedIn) */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image.startsWith('http') ? image : `${siteUrl}${image}`} />
      <meta property="og:url" content={window.location.href} />

      {/* Twitter Metadata */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image.startsWith('http') ? image : `${siteUrl}${image}`} />
    </Helmet>
  );
};

export default SEO;
