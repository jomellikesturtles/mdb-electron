export class DisplayedTorrent {
  private added?: string;
  private hash: string;
  private name: string;
  private size: number;
  constructor(added: string, hash: string, name?: string, size?: number) {
    this.added = added;
    this.hash = hash;
    this.name = name;
    this.size = size;
  }
  getAdded(): string {
    return this.added;
  }
  getHash(): string {
    return this.hash;
  }
  getName(): string {
    return this.name;
  }
  getSize(): number {
    return this.size;
  }
}
