
import React from 'react';
import { MenuItem } from '../types';
import MenuListItem from './MenuListItem';

interface MenuListProps {
  items: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
}

const MenuList: React.FC<MenuListProps> = ({ items, onSelectItem }) => {
  return (
    <section className="py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="space-y-6">
          {items.map((item, index) => (
            <MenuListItem 
              key={item.id} 
              item={item} 
              onSelectItem={onSelectItem}
              style={{ animationDelay: `${index * 100}ms` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuList;
