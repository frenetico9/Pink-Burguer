import React from 'react';
import { RestaurantInfo } from '../types';
import { AddressIcon, PAYMENT_METHODS } from '../constants';

interface LocationSectionProps {
  info: RestaurantInfo;
}

const LocationSection: React.FC<LocationSectionProps> = ({ info }) => {
  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-4xl sm:text-5xl text-center text-primary tracking-wider mb-8">
          Faça seu Pedido!
        </h2>
        <div className="max-w-2xl mx-auto bg-surface rounded-lg shadow-lg overflow-hidden border-2 border-primary/50 shadow-primary/20">
          <div className="p-8 text-center">
            <h3 className="font-bold text-textPrimary text-2xl mb-2">
              Retire no local
            </h3>
            <div className="flex justify-center items-center gap-2 mb-6">
                <AddressIcon className="text-accent text-xl" />
                <p className="font-semibold text-textPrimary text-lg">{info.address}</p>
            </div>
            
            <div className="w-1/3 mx-auto border-b-2 border-background my-8"></div>

            <h3 className="font-bold text-textPrimary text-2xl mb-4">
              Pague como preferir
            </h3>
            <p className="text-textSecondary mb-6 max-w-md mx-auto">
              Aceitamos as principais formas de pagamento para sua comodidade. É só escolher e se deliciar!
            </p>

            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
              {PAYMENT_METHODS.map((method) => (
                <div key={method.id} className="bg-background py-2 px-3 rounded-lg flex items-center gap-2 border border-gray-700 hover:border-primary transition-colors">
                  <span className="text-accent text-lg">{method.icon}</span>
                  <span className="text-textPrimary text-sm font-medium">{method.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
