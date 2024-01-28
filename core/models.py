from django.db import models

class User(models.Model):
    uid = models.AutoField(primary_key = True)
    name = models.CharField(max_length = 32, unique = True)
    profile_name = models.CharField(max_length = 32)
    password = models.CharField(max_length = 64)
    picture = models.CharField(max_length = 64, null = True)
    ownership_rankings = models.JSONField(default = dict)
    ownership_count = models.IntegerField(default = 0)
    last_activity_capture = models.DateTimeField(auto_now_add = True)
    level = models.PositiveIntegerField(default = 0)
    points = models.IntegerField(default = 0)

class IntConstant(models.Model):
    key = models.CharField(max_length = 20, primary_key = True)
    value = models.IntegerField()

class Harvest(models.Model):
    class Grade(models.TextChoices):
        COMMON = ("C", "Common")
        RARE = ("R", "Rare")
        EPIC = ("E", "Epic")
        ARCANE = ("A", "Arcane")
        SECRET = ("S", "Secret")
        EXTERNAL = ("X", "External")
    class Type(models.TextChoices):
        PLANT = ("P", "Plant")
        LANDMARK = ("L", "Location")
        AREA = ("A", "Area")
        CHALLENGE = ("C", "Challenge")
    hid = models.PositiveIntegerField(primary_key = True)
    name = models.CharField(max_length = 32, unique = True)
    source_name = models.CharField(max_length = 64, unique = True)
    detail = models.TextField()
    picture = models.CharField(max_length = 64)
    grade = models.CharField(max_length = 10, choices = Grade.choices, default = Grade.COMMON)
    type = models.CharField(max_length = 10, choices = Type.choices, default = Type.PLANT)
    ranking_top = models.IntegerField(default = 0)

class Raid(models.Model):
    rid = models.PositiveIntegerField(primary_key = True)
    start = models.DateTimeField(auto_now_add = True)
    duration = models.PositiveIntegerField(default = 60)
    objective = models.ForeignKey(Harvest, models.CASCADE)
    completions = models.IntegerField(default = 0)
    active = models.BooleanField(default = True)
