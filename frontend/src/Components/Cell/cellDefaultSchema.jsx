import uuid from "react-uuid";

export default function cellDefaultSchema(mx = 500, my = 500) {
  const id = uuid();

  return [
    id,
    {
      position: {
        x: mx,
        y: my,
      },
      nodes: {
        [`${id}$top`]: {
          next: {},
          prev: {},
        },
        [`${id}$right`]: {
          next: {},
          prev: {},
        },
        [`${id}$bottom`]: {
          next: {},
          prev: {},
        },
        [`${id}$left`]: {
          next: {},
          prev: {},
        },
      },
    },
  ];
}
