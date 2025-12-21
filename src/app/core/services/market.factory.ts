import { ComponentFactory, ComponentFactoryResolver, Injectable, Type, ViewContainerRef } from "@angular/core";

export type MarketFactoryMap<T> = {
  [key in MarketCountry]?: Type<T>;
};

export interface ComponentAnchor {
  viewContainerRef: ViewContainerRef;
}

@Injectable({ providedIn: 'root' })
export class MarketFactory {
  constructor(private resolver: ComponentFactoryResolver) { }
  get<T>(marketFactoryMap: MarketFactoryMap<T>,
    // country = this.environmentService.environment.country
    country = 'ap'
  ): Type<T> {
    return MarketFactory.get(marketFactoryMap, country);
  }

  createAnchoredComponent<T>(anchor: ComponentAnchor, marketFactoryMap: MarketFactoryMap<T>,
    // country = this.environmentService.environment.country
    country = 'ph'
  ) {
    anchor.viewContainerRef.clear();
    const componentFactory: ComponentFactory<T> = this.resolver.resolveComponentFactory(this.get(marketFactoryMap, country));
    const containerRef = anchor.viewContainerRef.createComponent(componentFactory);
    return containerRef.instance;
  }

  static get<T>(marketFactoryMap: MarketFactoryMap<T>, country: string): Type<T> {
    return marketFactoryMap[country] ?? marketFactoryMap.ap;
  }
}
export type MarketCountry = 'ap' | 'my' | 'id' | 'ph' | string;

export enum MarketCountryEnum {
  AP = 'ap',
  MY = 'my',
  PH = 'ph'
}