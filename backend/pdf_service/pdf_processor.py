"""
PDF Processing Service - Core functionality for PDF manipulation.
"""
import os
import uuid
from typing import List, Dict, Any, Optional, Tuple
from pathlib import Path
import tempfile

from pypdf import PdfReader, PdfWriter
from pikepdf import Pdf
import PyPDFForm

from common.models import APIResponse


class PDFProcessor:
    """Core PDF processing functionality."""
    
    @staticmethod
    def get_pdf_info(file_path: str) -> Dict[str, Any]:
        """
        Extract basic information from a PDF file.
        
        Args:
            file_path: Path to the PDF file
            
        Returns:
            Dictionary containing PDF metadata
        """
        try:
            # Use pypdf for basic info
            with open(file_path, 'rb') as f:
                reader = PdfReader(f)
                info = {
                    'page_count': len(reader.pages),
                    'is_encrypted': reader.is_encrypted,
                    'metadata': {}
                }
                
                # Extract metadata if available
                if reader.metadata:
                    for key, value in reader.metadata.items():
                        if key and value:
                            # Convert from possible PDF objects to string
                            info['metadata'][key] = str(value)
                
                # Check if the document has form fields
                info['has_form'] = len(reader.get_fields() or {}) > 0
                
                return info
        except Exception as e:
            raise ValueError(f"Error extracting PDF info: {str(e)}")
    
    @staticmethod
    def merge_pdfs(file_paths: List[str], output_path: str) -> str:
        """
        Merge multiple PDF files into a single PDF.
        
        Args:
            file_paths: List of paths to PDF files to merge
            output_path: Path where the merged PDF will be saved
            
        Returns:
            Path to the merged PDF file
        """
        try:
            merger = PdfWriter()
            
            for path in file_paths:
                merger.append(path)
                
            with open(output_path, 'wb') as f:
                merger.write(f)
                
            return output_path
        except Exception as e:
            raise ValueError(f"Error merging PDFs: {str(e)}")
    
    @staticmethod
    def split_pdf(file_path: str, output_dir: str) -> List[str]:
        """
        Split a PDF file into individual pages.
        
        Args:
            file_path: Path to the PDF file to split
            output_dir: Directory where the split pages will be saved
            
        Returns:
            List of paths to the individual PDF pages
        """
        try:
            reader = PdfReader(file_path)
            output_files = []
            
            for i, page in enumerate(reader.pages):
                writer = PdfWriter()
                writer.add_page(page)
                output_file = os.path.join(output_dir, f"page_{i+1}.pdf")
                
                with open(output_file, 'wb') as f:
                    writer.write(f)
                
                output_files.append(output_file)
                
            return output_files
        except Exception as e:
            raise ValueError(f"Error splitting PDF: {str(e)}")
    
    @staticmethod
    def extract_pages(file_path: str, pages: List[int], output_path: str) -> str:
        """
        Extract specific pages from a PDF file.
        
        Args:
            file_path: Path to the PDF file
            pages: List of page numbers to extract (1-based indexing)
            output_path: Path where the extracted pages will be saved
            
        Returns:
            Path to the new PDF file with extracted pages
        """
        try:
            reader = PdfReader(file_path)
            writer = PdfWriter()
            
            for page_num in pages:
                # Convert from 1-based to 0-based indexing
                if 1 <= page_num <= len(reader.pages):
                    writer.add_page(reader.pages[page_num - 1])
            
            with open(output_path, 'wb') as f:
                writer.write(f)
                
            return output_path
        except Exception as e:
            raise ValueError(f"Error extracting pages: {str(e)}")
    
    @staticmethod
    def rotate_pages(file_path: str, rotations: Dict[int, int], output_path: str) -> str:
        """
        Rotate specific pages in a PDF file.
        
        Args:
            file_path: Path to the PDF file
            rotations: Dictionary mapping page numbers (1-based) to rotation angles (in degrees)
            output_path: Path where the rotated PDF will be saved
            
        Returns:
            Path to the rotated PDF file
        """
        try:
            reader = PdfReader(file_path)
            writer = PdfWriter()
            
            for i, page in enumerate(reader.pages):
                # Convert from 0-based to 1-based for the dictionary lookup
                page_num = i + 1
                if page_num in rotations:
                    # Add the page with rotation
                    writer.add_page(page.rotate(rotations[page_num]))
                else:
                    # Add the page without rotation
                    writer.add_page(page)
            
            with open(output_path, 'wb') as f:
                writer.write(f)
                
            return output_path
        except Exception as e:
            raise ValueError(f"Error rotating pages: {str(e)}")
    
    @staticmethod
    def get_form_fields(file_path: str) -> Dict[str, Any]:
        """
        Extract form fields from a PDF file.
        
        Args:
            file_path: Path to the PDF file
            
        Returns:
            Dictionary containing form field information
        """
        try:
            # Use PyPDFForm to get form field information
            pdf_form = PyPDFForm.PdfWrapper(file_path)
            fields = pdf_form.get_fields()
            
            # Also get more detailed information using pypdf
            reader = PdfReader(file_path)
            pypdf_fields = reader.get_fields()
            
            result = {}
            
            # Combine information from both libraries
            if fields:
                for field_name, field_value in fields.items():
                    field_info = {
                        'name': field_name,
                        'value': field_value,
                        'type': 'unknown'
                    }
                    
                    # Try to get more detailed information from pypdf
                    if pypdf_fields and field_name in pypdf_fields:
                        pypdf_field = pypdf_fields[field_name]
                        if hasattr(pypdf_field, '/FT'):
                            field_type = pypdf_field['/FT']
                            if field_type == '/Tx':
                                field_info['type'] = 'text'
                            elif field_type == '/Btn':
                                field_info['type'] = 'checkbox' if hasattr(pypdf_field, '/AS') else 'button'
                            elif field_type == '/Ch':
                                field_info['type'] = 'choice'
                            elif field_type == '/Sig':
                                field_info['type'] = 'signature'
                    
                    result[field_name] = field_info
            
            return result
        except Exception as e:
            raise ValueError(f"Error extracting form fields: {str(e)}")
    
    @staticmethod
    def fill_form(file_path: str, form_data: Dict[str, Any], output_path: str) -> str:
        """
        Fill form fields in a PDF file.
        
        Args:
            file_path: Path to the PDF file
            form_data: Dictionary mapping field names to values
            output_path: Path where the filled PDF will be saved
            
        Returns:
            Path to the filled PDF file
        """
        try:
            # Use PyPDFForm to fill the form
            pdf_form = PyPDFForm.PdfWrapper(file_path).fill(form_data)
            
            with open(output_path, 'wb') as f:
                f.write(pdf_form.read())
                
            return output_path
        except Exception as e:
            raise ValueError(f"Error filling form: {str(e)}")
    
    @staticmethod
    def add_watermark(file_path: str, watermark_text: str, output_path: str) -> str:
        """
        Add a text watermark to each page of a PDF file.
        
        Args:
            file_path: Path to the PDF file
            watermark_text: Text to use as watermark
            output_path: Path where the watermarked PDF will be saved
            
        Returns:
            Path to the watermarked PDF file
        """
        try:
            # Create a temporary file for the watermark
            with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
                watermark_path = tmp.name
            
            # Create a watermark PDF using reportlab
            from reportlab.pdfgen import canvas
            from reportlab.lib.pagesizes import letter
            
            c = canvas.Canvas(watermark_path, pagesize=letter)
            width, height = letter
            
            # Set transparency
            c.setFillAlpha(0.3)
            # Set font and size
            c.setFont("Helvetica", 60)
            # Rotate text and position it
            c.saveState()
            c.translate(width/2, height/2)
            c.rotate(45)
            c.drawCentredString(0, 0, watermark_text)
            c.restoreState()
            c.save()
            
            # Apply the watermark to each page
            reader = PdfReader(file_path)
            watermark_reader = PdfReader(watermark_path)
            watermark_page = watermark_reader.pages[0]
            
            writer = PdfWriter()
            
            for page in reader.pages:
                page.merge_page(watermark_page)
                writer.add_page(page)
            
            with open(output_path, 'wb') as f:
                writer.write(f)
            
            # Clean up the temporary watermark file
            os.unlink(watermark_path)
                
            return output_path
        except Exception as e:
            raise ValueError(f"Error adding watermark: {str(e)}")
    
    @staticmethod
    def compress_pdf(file_path: str, output_path: str) -> str:
        """
        Compress a PDF file to reduce its size.
        
        Args:
            file_path: Path to the PDF file
            output_path: Path where the compressed PDF will be saved
            
        Returns:
            Path to the compressed PDF file
        """
        try:
            # Use pikepdf for compression
            with Pdf.open(file_path) as pdf:
                # Save with compression settings
                pdf.save(output_path, 
                         compress_streams=True, 
                         object_stream_mode=1,
                         normalize_content=True,
                         linearize=False)
                
            return output_path
        except Exception as e:
            raise ValueError(f"Error compressing PDF: {str(e)}")
    
    @staticmethod
    def extract_text(file_path: str, page_numbers: Optional[List[int]] = None) -> Dict[int, str]:
        """
        Extract text from a PDF file.
        
        Args:
            file_path: Path to the PDF file
            page_numbers: Optional list of page numbers to extract text from (1-based indexing)
            
        Returns:
            Dictionary mapping page numbers to extracted text
        """
        try:
            reader = PdfReader(file_path)
            result = {}
            
            # If no page numbers specified, extract from all pages
            if not page_numbers:
                page_numbers = list(range(1, len(reader.pages) + 1))
            
            for page_num in page_numbers:
                if 1 <= page_num <= len(reader.pages):
                    # Convert from 1-based to 0-based indexing
                    page = reader.pages[page_num - 1]
                    text = page.extract_text()
                    result[page_num] = text
            
            return result
        except Exception as e:
            raise ValueError(f"Error extracting text: {str(e)}")
