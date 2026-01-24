class CustomDesign {
  final String baseColor; // Hex string, e.g., "0xFF000000"
  final String text;
  final double textX;
  final double textY;
  final double fontSize;
  final String textColor; // Hex string

  // Future: Stickers list

  CustomDesign({
    this.baseColor = "0xFFFFFFFF", // Default white
    this.text = "",
    this.textX = 0,
    this.textY = 0,
    this.fontSize = 20,
    this.textColor = "0xFF000000",
  });

  CustomDesign copyWith({
    String? baseColor,
    String? text,
    double? textX,
    double? textY,
    double? fontSize,
    String? textColor,
  }) {
    return CustomDesign(
      baseColor: baseColor ?? this.baseColor,
      text: text ?? this.text,
      textX: textX ?? this.textX,
      textY: textY ?? this.textY,
      fontSize: fontSize ?? this.fontSize,
      textColor: textColor ?? this.textColor,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'baseColor': baseColor,
      'text': text,
      'textX': textX,
      'textY': textY,
      'fontSize': fontSize,
      'textColor': textColor,
    };
  }

  factory CustomDesign.fromJson(Map<String, dynamic> json) {
    return CustomDesign(
      baseColor: json['baseColor'] ?? "0xFFFFFFFF",
      text: json['text'] ?? "",
      textX: (json['textX'] as num?)?.toDouble() ?? 0,
      textY: (json['textY'] as num?)?.toDouble() ?? 0,
      fontSize: (json['fontSize'] as num?)?.toDouble() ?? 20,
      textColor: json['textColor'] ?? "0xFF000000",
    );
  }
}
