import pytest

from apps.content.models import DailySongCollection, QRCodeRecord, Song

from .conftest import authed_client

pytestmark = pytest.mark.django_db


@pytest.fixture
def song(church):
    return Song.objects.create(church=church, title="Amazing Grace", lyrics="Amazing grace, how sweet the sound...")


@pytest.fixture
def collection(chairperson_a, song):
    client = authed_client(chairperson_a)
    response = client.post(
        "/api/v1/song-collections/",
        {"date": "2026-09-07", "service_name": "Sunday Mass", "items": [{"song": str(song.id), "order": 0}]},
        format="json",
    )
    assert response.status_code == 201
    return DailySongCollection.objects.get(id=response.data["id"])


def test_collection_created_with_items(collection, song):
    assert collection.items.count() == 1
    assert collection.items.first().song_id == song.id


def test_generate_qr_creates_record_and_public_endpoints_work(settings, tmp_path, chairperson_a, collection, api_client):
    settings.MEDIA_ROOT = tmp_path

    client = authed_client(chairperson_a)
    response = client.post(f"/api/v1/song-collections/{collection.id}/generate-qr/")
    assert response.status_code == 200
    assert response.data["target_url"].endswith(f"/song-sheet/{collection.id}")
    assert response.data["qr_image"]

    record = QRCodeRecord.objects.get(daily_song_collection=collection)
    assert record.scan_count == 0

    public_response = api_client.get(f"/api/v1/public/song-collections/{collection.id}/")
    assert public_response.status_code == 200
    assert public_response.data["songs"][0]["title"] == "Amazing Grace"

    scan_response = api_client.post(f"/api/v1/public/song-collections/{collection.id}/scan/")
    assert scan_response.status_code == 200
    record.refresh_from_db()
    assert record.scan_count == 1
