import React from 'react';
import { RestaurantInfo } from '../types';

interface HeaderProps {
  info: RestaurantInfo;
}

const Header: React.FC<HeaderProps> = ({ info }) => {
  return (
    <header 
      className="fixed top-0 left-0 right-0 z-30 h-20 flex items-center transition-all duration-300 bg-black/30 backdrop-blur-sm"
      aria-label="Cabeçalho com logo Pink Burguer"
    >
      <div className="container mx-auto px-4">
        {info.logoUrl && (
          <img
            src={info.logoUrl}
            alt={`Logo de ${info.name}`}
            className="h-12 sm:h-14 w-auto object-contain"
          />
        )}
      </div>
    </header>
  );
};

export default Header;
