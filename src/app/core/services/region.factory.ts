import { ComponentFactory, ComponentFactoryResolver, Injectable, Type, ViewContainerRef } from "@angular/core";

export type RegionMap<T> = {
  [key in Region]?: Type<T>;
};

export interface ComponentAnchor {
  viewContainerRef: ViewContainerRef;
}

@Injectable({ providedIn: 'root' })
export class RegionFactory {
  constructor(private resolver: ComponentFactoryResolver) { }

  get<T>(regionMap: RegionMap<T>,
    region: Region = 'world'
  ): Type<T> {
    return RegionFactory.get(regionMap, region);
  }

  createAnchoredComponent<T>(anchor: ComponentAnchor, regionMap: RegionMap<T>,
    region: Region = 'world'
  ) {
    anchor.viewContainerRef.clear();
    const componentFactory: ComponentFactory<T> = this.resolver.resolveComponentFactory(this.get(regionMap, region));
    const containerRef = anchor.viewContainerRef.createComponent(componentFactory);
    return containerRef.instance;
  }

  static get<T>(regionMap: RegionMap<T>, region: string): Type<T> {
    return regionMap[region] ?? regionMap.world;
  }
}
export type Region = 'north-america' | 'europe' | 'asia' | 'oceania' | 'world' | string;

export enum RegionEnum {
  NORTH_AMERICA = 'north-america',
  EUROPE = 'europe',
  ASIA = 'asia',
  OCEANIA = 'oceania',
  WORLD = 'world'
}
