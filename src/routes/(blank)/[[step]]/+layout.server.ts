import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({ params }) => {
  let step, next;
  switch (params.step) {
    case "id":
      step = 0;
      next = "passport";
      break;
    case "passport":
      step = 1;
      next = "review";
      break;
    case "review-application":
      step = 2;
      next = null;
      break;
    default:
      step = 0;
      next = "id";
      break;
  }
  return {
    step,
    next,
  };
};
