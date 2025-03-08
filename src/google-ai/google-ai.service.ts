import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GoogleAiService {
  private readonly genAi: GoogleGenerativeAI;

  constructor() {
    this.genAi = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  }

  async processFile(file: Express.Multer.File) {
    if (!file) {
      throw new InternalServerErrorException('No file provided');
    }

    try {
      const model = this.genAi.getGenerativeModel({
        model: 'gemini-1.5-flash',
      });

      const prompt = `
        Extrae la siguiente información del documento y responde **SOLO en JSON**.
        No incluyas texto adicional antes o después del JSON. Formato exacto:

        {
          "name": "Nombre del candidato",
          "age": Edad en número,
          "skills": ["Lista de habilidades"],
          "work_experience": [
            {
              "role": "Cargo",
              "date": "Fecha",
              "description": "Descripción"
            }
          ]
        }
      `;

      const result = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: file.mimetype,
                  data: file.buffer.toString('base64'),
                },
              },
            ],
          },
        ],
      });

      let responseText = result.response.text().trim();

      responseText = responseText.replace(/^```json|```$/g, '').trim();

      let jsonResponse;
      try {
        jsonResponse = JSON.parse(responseText);
      } catch (error) {
        throw new InternalServerErrorException(
          `Error parsing JSON response: ${error.message}. Respuesta obtenida: ${responseText}`,
        );
      }

      return {
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        content: jsonResponse,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error processing the file: ${error.message}`,
      );
    }
  }
}
