import React from 'react';
import { RestaurantInfo } from '../types';
import { InstagramIcon, WhatsAppIcon } from '../constants';

interface FooterProps {
  info: RestaurantInfo;
}

const Footer: React.FC<FooterProps> = ({ info }) => {
  return (
    <footer className="bg-surface text-textSecondary py-8 px-4 border-t-2 border-primary">
      <div className="container mx-auto text-center">
        <h3 className="font-display text-4xl text-primary mb-4">{info.name}</h3>
        
        <div className="flex justify-center space-x-6 my-5">
          <a href={info.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-textSecondary hover:text-primary transition-colors text-3xl">
            <InstagramIcon />
          </a>
          <a href={`https://wa.me/${info.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-textSecondary hover:text-primary transition-colors text-3xl">
             <WhatsAppIcon />
          </a>
        </div>
        
        <p className="text-xs opacity-60">
          &copy; {new Date().getFullYear()} {info.name}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;