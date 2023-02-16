export const renderConfirmAndCancel = () => {
  return ["确定", "取消"].map((key: string) => {
    return {
      comp: "el-button",
      attr: {
        size: "default",
        color: key === "确定" ? themeColor : "",
      },
      event: {
        submit: () => {},
      },
      content: {
        text: key,
      },
    };
  });
};
