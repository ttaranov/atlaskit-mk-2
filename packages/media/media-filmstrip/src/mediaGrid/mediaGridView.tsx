MediaItem {
  dataURI: string;
  dimensions: {
    width: number,
    height: number,
  }  
}

<MediaGripView
  items={MediaItem[]}
  width?={number}
  itemsPerRow?={3}
/>