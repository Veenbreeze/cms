"""
QR code generation for daily song collections. A code always points at the
public, unauthenticated song-sheet page for that collection — congregants
scan it during a service to read the day's lyrics on their own phone.
"""
from io import BytesIO

import qrcode
from django.conf import settings
from django.core.files.base import ContentFile

from ..models import QRCodeRecord


def generate_qr_for(collection):
    """Create or refresh the QRCodeRecord for a DailySongCollection and return it."""
    target_url = f"{settings.FRONTEND_BASE_URL}/song-sheet/{collection.id}"

    image = qrcode.make(target_url)
    buffer = BytesIO()
    image.save(buffer, format="PNG")

    record, _ = QRCodeRecord.objects.get_or_create(
        daily_song_collection=collection,
        defaults={"target_url": target_url},
    )
    record.target_url = target_url
    record.qr_image.save(f"song-collection-{collection.id}.png", ContentFile(buffer.getvalue()), save=False)
    record.save(update_fields=["target_url", "qr_image", "updated_at"])
    return record
