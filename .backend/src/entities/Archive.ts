import { v4 as uuidv4 } from 'uuid';

class Archive {
  archive_id?: string;
  
  archive_name: string;
  
  archive_localization: string;
  
  created_at: Date;
  
  archive_extension: string;
  
  archive_mime_type: string;

  constructor(
    archive_name: string,
    archive_localization: string,
    archive_extension: string,
    archive_mime_type: string
  ) {
    this.archive_id = this.archive_id || uuidv4();
    this.archive_name = archive_name;
    this.archive_localization = archive_localization;
    this.archive_extension = archive_extension;
    this.archive_mime_type = archive_mime_type;
    this.created_at = new Date();
  }
}

export { Archive };
