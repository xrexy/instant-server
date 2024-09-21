export type StatusResponse<R = unknown> =
  | {
      status: "success";
      data: R;
    }
  | { status: "error"; message: string };
