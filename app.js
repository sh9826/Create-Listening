async function generate() {
  try {
    const title = document.getElementById("title").value.trim();
    const level = document.getElementById("level").value;

    const path =
      level === "beginner"
        ? "templates/beginner.docx"
        : "templates/intermediate.docx";

    const response = await fetch(path);
    const content = await response.arrayBuffer();

    const zip = new PizZip(content);

    const doc = new window.docxtemplater(zip, {
  paragraphLoop: true,
  linebreaks: true,
  delimiters: { start: "{", end: "}" }
});

    doc.render({
      TITLE: title,
      Q1: "",
      Q2: "",
      A1: "",
      A2: ""
    });

    const blob = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = title + ".docx";
    link.click();

  } catch (error) {
    console.log(error);
    alert("오류: " + error.message);
  }
}
