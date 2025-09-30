export interface MenuItem {
  name: string;
  description: string;
  price: string;
  badges?: string[];
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}
