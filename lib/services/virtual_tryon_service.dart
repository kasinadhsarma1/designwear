import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:path_provider/path_provider.dart';

/// Service to handle Virtual Try-On using Google AI Studio Gemini API
class VirtualTryOnService {
  static const String _baseUrl =
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

  String? get _apiKey => dotenv.env['GEMINI_API_KEY'];

  /// Generate a virtual try-on image
  /// [personImageBytes] - Image of the person (user's photo)
  /// [clothingImageBytes] - Image of the clothing item
  /// Returns the generated try-on image as bytes, or null if failed
  Future<Uint8List?> generateTryOn({
    required Uint8List personImageBytes,
    required Uint8List clothingImageBytes,
  }) async {
    if (_apiKey == null || _apiKey!.isEmpty || _apiKey == 'your_gemini_api_key_here') {
      throw VirtualTryOnException('Gemini API key not configured. Please add GEMINI_API_KEY to .env file');
    }

    try {
      final personBase64 = base64Encode(personImageBytes);
      final clothingBase64 = base64Encode(clothingImageBytes);

      final requestBody = {
        'contents': [
          {
            'parts': [
              {
                'text': '''You are a fashion AI assistant specializing in virtual try-on. 
                
Your task: Take the clothing item from the second image and realistically place it on the person in the first image.

Requirements:
- Maintain the person's pose and body proportions
- Adjust the clothing to fit naturally on the person
- Preserve realistic lighting and shadows
- Keep the background from the person's original photo
- Make the result look like a real photograph

Generate the final image showing the person wearing the clothing item.'''
              },
              {
                'inlineData': {
                  'mimeType': 'image/jpeg',
                  'data': personBase64,
                }
              },
              {
                'inlineData': {
                  'mimeType': 'image/jpeg',
                  'data': clothingBase64,
                }
              }
            ]
          }
        ],
        'generationConfig': {
          'responseModalities': ['image', 'text'],
          'temperature': 0.4,
        }
      };

      final response = await http.post(
        Uri.parse('$_baseUrl?key=$_apiKey'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode(requestBody),
      );

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);
        
        // Extract the generated image from the response
        final candidates = responseData['candidates'] as List?;
        if (candidates != null && candidates.isNotEmpty) {
          final content = candidates[0]['content'];
          final parts = content['parts'] as List?;
          
          if (parts != null) {
            for (final part in parts) {
              if (part['inlineData'] != null) {
                final imageData = part['inlineData']['data'] as String;
                return base64Decode(imageData);
              }
            }
          }
        }
        
        throw VirtualTryOnException('No image generated in response');
      } else {
        final errorData = jsonDecode(response.body);
        final errorMessage = errorData['error']?['message'] ?? 'Unknown error';
        throw VirtualTryOnException('API Error: $errorMessage');
      }
    } catch (e) {
      if (e is VirtualTryOnException) rethrow;
      throw VirtualTryOnException('Failed to generate try-on: $e');
    }
  }

  /// Save the generated image to device storage
  Future<File> saveImage(Uint8List imageBytes, String fileName) async {
    final directory = await getApplicationDocumentsDirectory();
    final file = File('${directory.path}/$fileName');
    await file.writeAsBytes(imageBytes);
    return file;
  }

  /// Convert image file to bytes
  Future<Uint8List> fileToBytes(File file) async {
    return await file.readAsBytes();
  }

  /// Check if the API is configured
  bool get isConfigured {
    final key = _apiKey;
    return key != null && key.isNotEmpty && key != 'your_gemini_api_key_here';
  }
}

/// Custom exception for Virtual Try-On errors
class VirtualTryOnException implements Exception {
  final String message;
  VirtualTryOnException(this.message);

  @override
  String toString() => message;
}
