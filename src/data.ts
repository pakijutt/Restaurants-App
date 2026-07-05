import { Product, UserProfile } from './types';

export const CATEGORIES = [
  { id: 'burgers', label: 'Burgers', emoji: '🍔' },
  { id: 'pizza', label: 'Pizza', emoji: '🍕' },
  { id: 'wraps', label: 'Wraps', emoji: '🌯' },
  { id: 'fries', label: 'Fries', emoji: '🍟' },
  { id: 'drinks', label: 'Drinks', emoji: '🥤' },
  { id: 'sides', label: 'Sides', emoji: '🍗' },
] as const;

export const PRODUCTS: Product[] = [
  {
    id: 'classic-zinger',
    name: 'Classic Zinger',
    description: 'Original spicy crispy chicken fillet with fresh lettuce and spicy mayo.',
    price: 450,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPz9N27rZ8gVwELBJi2GvMeCKuVKWd6Xw8gw3FhwIAqR-T4aA726DOkNV23W8-Mh11Qw_3sMvxpqIuF4Jxoi3OqPcPMdkyycG7kJ7e9H1X5g1foMJJ-HYbk-KeJsbHUFI5zIU_ax7M4OHPO41NqzQexuTnUgKRZ5ZykReD3Pmc9fZvkf80J8WXMr9_xv1-IDzRDFisoiOYTUFHfHdQi8Sdc3mMXetGufgyX3Av7SkZo5UnaYrwjg4i',
    category: 'burgers',
    rating: 4.8,
    isBestSeller: true,
  },
  {
    id: 'deep-pan-pizza',
    name: 'Deep Pan Pizza',
    description: 'Thick golden crust loaded with premium cheese and our special signature sauce.',
    price: 890,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCvtcDrx93i0_D6s0a7w8tfORRrj-o5qVUeumfi3X9b3P0zNkUDY9qvfYrKXW2BOz0xAXE8T0jWnOjhiESJBsRs0EdkjFoBkODniuSU88DKqypz8tLlpBNyJkRMQRpyitC2S6ZOAghta18g1071qwXf93e3_AiXggmV5RB4NBpkjG-Ms7vAjqtnLAAghRLQRUVzxPDUiVVQMvvs0P_YBUpuOEvW1w9BW2AD_Ws2yp13YvkmqvGB3kD',
    category: 'pizza',
    rating: 4.7,
    isSizzling: true,
  },
  {
    id: 'zinger-burger',
    name: 'Zinger Burger',
    description: 'Crispy fried chicken breast piece served with crisp lettuce and smooth mayo.',
    price: 280,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9njZjb2v65s-27wZxI3u0EsROgE7fKZ4D9C2S-fibh13PDVCWRH40cTWi6aL6SX4oChub_1C0wIjpcS9Ss6bUXFf_-eCW0YeTNU1KQt6wzpvW4_qw7qdq9yrh2Rs-LAaQtCTROMVhTQIFWKZMlOoMmAWeAWOk5x_ZlQYJY4Eky2ZztMXntt0n8rW6W8ibn6KE67Uhn5GdW3pH1dEyC62LTQryvY9hR3kW_X5Cxc3Czg8nTS14sGAL',
    category: 'burgers',
    rating: 4.9,
    badgeText: 'BEST SELLER',
    isBestSeller: true,
  },
  {
    id: 'crunch-burger',
    name: 'Crunch Burger',
    description: 'Extreme crunch with signature secret spicy sauce and premium cheddar cheese slice.',
    price: 310,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3MPBEjolGCz2FvvC62tQWR_gg6q_xoBn6V4h_VH4mmxfhJ9GJJzhYlkCts0mLmmmFUO4VjG9hx5hIfLUWhbTN0FgJ5-nwYun0kPImZJvKROjzo4PMzvjPOoEZTl0BafKXRkY-V4G9Tuf_ShrmVAAFLw3jz24wSkVSCq5H8VXYRZ07WD2LkKq3Rhtji73XBwEGX6k9XCM88n7pmBQylSGwdxsm5PS_nXKznb7Mvz6lj5TWsgG0oaQJ',
    category: 'burgers',
    rating: 4.6,
  },
  {
    id: 'chicken-tikka-pizza',
    name: 'Chicken Tikka Pizza',
    description: 'Local wood-fired Pakistani flavors meet bubbly premium cheesy goodness.',
    price: 850,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMUNEd8K4ivwFjtgSR-88uio5gqnY9O-hKnvktGeJldVneOS5nFqqdpsOptKr--P-dkf2aYEt_L7n_TMDnHAPNuixy4I5IoLrY276twmV7-pelKQQnqMQ4JiHNdA2zT0wQv-zlN3St1Usqmo0BOLWVN_Ag2JvtWoU-aXSoyFSQ_ir_1o8W9WuagskSHgk-Lmeu0sbKW1Fz7BG1U0UNgRfJf1VysjuVU3Fo7LIIJwbB95c_o6Sh45WE',
    category: 'pizza',
    rating: 4.8,
    isNew: true,
    badgeText: 'NEW HOT',
  },
  {
    id: 'chapli-burger',
    name: 'Chapli Burger',
    description: 'Authentic Peshawari spiced minced meat patty with tomato and fresh onions.',
    price: 260,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB54G_mxpyvp4d-eJ5ceH_9Uq3Wju2T_czAKR2JaKKDVYqKtuMycKzrVJN1u9Y53o6xagFWMIv96mwfqMgIAlNLBTK1n0C0KFxuYFZZb8xcAes18Wf1Y2MyFiDFD8OSi4O_Op7y2GlvX5xtCP3wfMiHXT3RH9-tG05E3T1qLK2cs6oOHK2QAZyLIRqyVsuidGfi-7tfm5y8k6j4l-uZ5Lx73KzkW9bm_s-FKDYN3kOp2JRNY6Ocxd0u',
    category: 'burgers',
    rating: 4.5,
  },
  {
    id: 'triple-stack-zinger',
    name: 'Triple Stack Zinger',
    description: 'A towering gourmet masterpiece of three massive, ultra-crispy golden-brown fried chicken patties, layered with thick melted cheese.',
    price: 12.5,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-sTYQUiwpS27VZINCcPO5wch5-Q3Rm2IbDByScDbebuR2h5votTFWvzXxFd2Bh9_CdK0OoKBTend3nyY-19A99EI_Ufjd8J24dMUf3Af1sr6V_A06mKPDeupX9XG8Oilefda7lOvCfSHpP99b7-2PXmbrv2oU9xT2SYDNgXZ-YymfKoZmfomEk-Itsxds0h1RHQQOHMxPRBNG0S2uTaZO9gogR7y0aSlOFv0g597ITEUDRM3gtPF4',
    category: 'burgers',
    rating: 4.9,
    isBestSeller: true,
  },
  {
    id: 'fiery-wings',
    name: 'Fiery Wings (6pcs)',
    description: 'Glistening chicken wings tossed in signature spicy pepper glaze, smoked to perfection.',
    price: 7.99,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcr0_kpvfKerB17YmEckDm80PX_cMLNBf14JNY4MPq1xoCBWc0voTmVIRslaBFngBqu4Jsx4U-9rhxuUXAnY82rLoLTWnacDAL94N4T6cwZ2W5cYlK-T8bz4UGtVV_K7p275tYp-NWaxn_vwRpytbjAMMKJlxWKaPKPtFV6Hj9qejThfNC6bd3AEt-tkSye59UzbF7FiiT9ZsOzxOBnTWM7k13giFp47izN5Nch34u21hP0RQqZGna',
    category: 'sides',
    rating: 4.8,
  },
  {
    id: 'authentic-chapli',
    name: 'Authentic Beef Chapli',
    description: 'Decadent beef chapli burger with fresh garden herbs, red onions, and refreshing cool yogurt sauce.',
    price: 9.5,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARE4nbu44nST5sEvdTxAcGvipXpDiGEthwOK89g98HmqUT2advxgKFKcuYKxOoALvHB1Hc6lk0DR081ftf7JgyZ5l916umC3jf0RRZeKxsWg42Uc8rJh1jmczfVvMd_OQIv8XzycIN3zMX_qY9wvV22FENpk-vgAB0HEeHotiYjkv0xmuw46W_LZr-_AlCdcLVgBqkkyhSj-PFwgS09LS7RSKHUcmeV6oZpNK-R7rVTBN-uSTEj6ql',
    category: 'burgers',
    rating: 4.5,
  },
  {
    id: 'zinger-loaded-fries',
    name: 'Zinger Loaded Fries',
    description: 'Gourmet golden fries covered in bubbling liquid cheese, diced crunchy zinger bites, jalapenos, and spicy house drizzle.',
    price: 6.25,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9vwWSrw3K6c-YiS1zA-je-90Eq075LJo653A9k3OUyLNo8j5KjZsU22WzZZNruYP69XcBIPhmvGVWC4lZcBMpkrQgdxAkYuz6Y_bk7V9WqgVg1mevQwOZpcVDDRlYNNJFxGDC4mmgBkbcs6cu7xgolYGfqlNHClKGv6X1CJorJzgq77shcyOpAcEKCLgIIN6ZFcSAPdwVyde7Aw01iG7_hgMb_Jgmwnnpkp54kKM4r_lgaKPHGTuH',
    category: 'fries',
    rating: 4.7,
  },
  {
    id: 'large-fries',
    name: 'Large Fries',
    description: 'Classic crispy golden-brown french fries, hot and seasoned with peri-peri spices.',
    price: 4.5,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDui7Bbzmfos8DZMSH2gdDHnWaV1e4uU9HrLzat2IEH4fBe44s5wq3ZOtjbz9scbD5BYkAIpRIUl5iFAN0rG1logCdJSh0NcYzg325FaSl2JQ5A-EeqTOFeRjfdaKKZZUE1KFi1WaLjoshrT-sjaXQdgJnjYYqTqBruNlckWguVjwlED_XqONMnqlcNDRiwuwdB6F2xwezNSQm5pNSn0kDR4wLgxnRLFNxNGlVpw8SpuXVmefZjTl9J',
    category: 'fries',
    rating: 4.6,
  },
  {
    id: 'chilled-soda',
    name: 'Chilled Soda Cola',
    description: '1.5L Chilled refreshing soda bottle.',
    price: 150,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7r5uVxLTj6DKFM5fAo_FE1lFUpfm4vk6T06-19ZCOTmbNkjICaM2ZQ3Yti3I8bY6yHb8pZ63bmf2m1CuZ5DgR7iNBTwxXGqsZI_O3HPyQCQlLIWG6oU9xSazKJIEItbYcdRPe8iABvqCESEdOl-1wE-dTDpc9QV51EXrBjUvNEd-JKX5-jAZ0Nb3vPgkSbo1ncFLQgjAdBc38-k--pk6HG5qFQVPUjIEzW4AUyw9YzNF0HmdRT71V',
    category: 'drinks',
    rating: 4.5,
  }
];

export const INITIAL_USER: UserProfile = {
  name: 'Zinger Fan',
  tier: 'GOLD',
  points: 1240,
  profilePic: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAJuarxz2r-663VctaZHxS0XvlXAhoGW3F4GrrizGQ3Zcr9R0yNOLwMJdJyQImOGu0TqBUPEwF16wOcbBslZWN91bojOStNO0jD2m92pTyQaj3SOq3gpevU-lEB0ezMBwVl3OmHNNPGNjSsBO1z3ZQrnDbai4lsT0tN6HmolGjyIuIt8dP9KWHIL1KOQ4_z-shQAcWWHyk_h_OKcypU9WYkSzbpgGyG-dvWwZg3W6rz5XISm3TqVsT',
  phone: '+1 234 567 890',
  address: 'Goal Tanki Chowk, Main Street, Area 51',
};

export const FLASH_DEALS = [
  {
    id: 'deal-mega-saver',
    title: 'MEGA SAVER BUNDLE',
    badge: 'Family Deal',
    description: '2 Large Pizzas + 4 Burgers + 1.5L Coke',
    price: 2499,
    oldPrice: 3200,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7r5uVxLTj6DKFM5fAo_FE1lFUpfm4vk6T06-19ZCOTmbNkjICaM2ZQ3Yti3I8bY6yHb8pZ63bmf2m1CuZ5DgR7iNBTwxXGqsZI_O3HPyQCQlLIWG6oU9xSazKJIEItbYcdRPe8iABvqCESEdOl-1wE-dTDpc9QV51EXrBjUvNEd-JKX5-jAZ0Nb3vPgkSbo1ncFLQgjAdBc38-k--pk6HG5qFQVPUjIEzW4AUyw9YzNF0HmdRT71V',
  }
];

export const PROFILE_NAV_ITEMS = [
  { id: 'profile', label: 'My Profile', icon: 'account_circle' },
  { id: 'history', label: 'Order History', icon: 'history' },
  { id: 'payments', label: 'Payment Methods', icon: 'payments' },
  { id: 'promo', label: 'Promo Codes', icon: 'confirmation_number', badge: '3 Active Coupons' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
  { id: 'help', label: 'Help Center', icon: 'help_outline' },
] as const;
